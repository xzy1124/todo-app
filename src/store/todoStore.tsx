// src/store/todoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Todo } from '../types/todo';
import { addTodo as apiAdd, updateTodo as apiUpdate, deleteTodo as apiDelete, getTodo as apiGet } from '../api/todoApi';
import { useToastStore } from './toastStore';

export interface OfflineAction {
    type: 'add' | 'update' | 'delete';
    todo: Todo;
}

interface TodoState {
    todos: Todo[];
    offlineQueue: OfflineAction[];

    // ---- Actions ----
    addTodo: (title: string, deadline?: string, group?: string) => void;
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
    completeAll: () => void;
    deleteAll: () => void;

    // ---- 离线同步 ----
    syncTodos: () => Promise<void>;

    // ---- 初始化 todos ----
    fetchTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoState>()(
    persist(
        (set, get) => ({
            todos: [],
            offlineQueue: [],

            fetchTodos: async () => {
                try {
                    const res = await apiGet();
                    // 确保 todos 始终是数组
                    const todosData = Array.isArray(res.data) ? res.data : [];
                    set({ todos: todosData });
                } catch (err) {
                    console.warn('⚠️ 获取服务器 todos 失败，使用本地缓存', err);
                    // 出错时确保 todos 是数组
                    if (!Array.isArray(get().todos)) {
                        set({ todos: [] });
                    }
                }
            },

            addTodo: (title, deadline, group) => {
                const tempId = Date.now();
                const newTodo: Todo = { id: tempId, title, completed: false, deadline, group };

                // 1️⃣ 更新本地状态
                set({ todos: [newTodo, ...get().todos] });

                // 2️⃣ 尝试同步到服务器
                apiAdd(title, deadline, group)
                    .then(res => {
                        set({
                            todos: get().todos.map(t => t.id === tempId ? res.data : t)
                        });
                    })
                    .catch(() => {
                        // 3️⃣ 离线加入队列
                        set({ offlineQueue: [...get().offlineQueue, { type: 'add', todo: newTodo }] });
                    });
            },

            toggleTodo: (id) => {
                const todo = get().todos.find(t => t.id === id);
                if (!todo) return;

                // 1️⃣ 本地更新
                set({
                    todos: get().todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
                });

                // 2️⃣ 同步到服务器
                apiUpdate(id, { completed: !todo.completed })
                    .catch(() => {
                        set({
                            offlineQueue: [...get().offlineQueue, { type: 'update', todo: { ...todo, completed: !todo.completed } }]
                        });
                    });
            },

            deleteTodo: (id) => {
                const todo = get().todos.find(t => t.id === id);
                if (!todo) return;
                // 获取toastStore仓库的操作
                const {addToast} = useToastStore.getState();

                // 1️⃣ 本地删除
                set({ todos: get().todos.filter(t => t.id !== id) });
                addToast('删除成功', 'success')

                // 2️⃣ 同步到服务器
                apiDelete(id)
                    .catch(() => {
                        set({ offlineQueue: [...get().offlineQueue, { type: 'delete', todo }] });
                    });
            },

            completeAll: () => {
                // 1️⃣ 本地更新
                set({
                    todos: get().todos.map(t => ({ ...t, completed: true }))
                });

                // 2️⃣ 尝试同步未完成的到服务器
                get().todos.forEach(todo => {
                    if (!todo.completed) {
                        apiUpdate(todo.id, { completed: true })
                            .catch(() => {
                                set({
                                    offlineQueue: [...get().offlineQueue, { type: 'update', todo: { ...todo, completed: true } }]
                                });
                            });
                    }
                });
            },

            deleteAll: () => {
                // 1️⃣ 本地清空
                set({ todos: [] });

                // 2️⃣ 尝试同步删除
                get().todos.forEach(todo => {
                    apiDelete(todo.id)
                        .catch(() => {
                            set({ offlineQueue: [...get().offlineQueue, { type: 'delete', todo }] });
                        });
                });
            },

            syncTodos: async () => {
                const queue = get().offlineQueue;
                if (queue.length === 0) return;

                let updatedTodos = [...get().todos];
                const remainingQueue: OfflineAction[] = [];

                for (const action of queue) {
                    try {
                        if (action.type === 'add') {
                            const res = await apiAdd(action.todo.title, action.todo.deadline, action.todo.group);
                            updatedTodos = updatedTodos.map(t => t.id === action.todo.id ? res.data : t);
                        } else if (action.type === 'update') {
                            await apiUpdate(action.todo.id, { completed: action.todo.completed });
                        } else if (action.type === 'delete') {
                            await apiDelete(action.todo.id);
                            updatedTodos = updatedTodos.filter(t => t.id !== action.todo.id);
                        }
                    } catch (err) {
                        console.log(err);
                        remainingQueue.push(action);
                    }
                }

                set({ todos: updatedTodos, offlineQueue: remainingQueue });
            }
        }),
        { name: 'todo-storage' } // persist 的 key
    )
);
