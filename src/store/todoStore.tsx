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
    addTodo: (title: string, deadline?: string, group?: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    completeAll: () => void;
    deleteAll: () => void;
    syncTodos: () => Promise<void>;
    fetchTodos: () => Promise<void>;
    clearAll: () => void;
}

export const useTodoStore = create<TodoState>()(
    persist(
        (set, get) => ({
            todos: [],
            offlineQueue: [],

            fetchTodos: async () => {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.warn('⚠️ 未登录用户，无法获取 todos');
                    set({ todos: [] });
                    return;
                }
                try {
                    const res = await apiGet(userId);
                    // 不确定返回的res是否是数组，所以这里做一下判断
                    const data = Array.isArray(res) ? res : [];
                    set({ todos: data });
                } catch (err) {
                    console.warn('⚠️ 获取服务器 todos 失败', err);
                    set({ todos: [] });
                }
            },

            addTodo: (title, deadline, group) => {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.warn('⚠️ 未登录用户，无法添加 todo');
                    return;
                }
                const tempId = Date.now().toString(); // 临时字符串 id
                // 创建的新待办是带有用户id的知道是谁办的
                const newTodo: Todo = { id: tempId, title, completed: false, deadline, group, user_id: userId };

                set({ todos: [newTodo, ...get().todos] });

                apiAdd(title, deadline, group, userId)
                    .then(res => {
                        set({
                            todos: get().todos.map(t => (t.id === tempId ? res : t))
                        });
                    })
                    .catch(() => {
                        set({ offlineQueue: [...get().offlineQueue, { type: 'add', todo: newTodo }] });
                    });
            },

            toggleTodo: (id) => {
                const todo = get().todos.find(t => t.id === id);
                if (!todo) return;

                set({
                    todos: get().todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
                });

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
                const { addToast } = useToastStore.getState();

                set({ todos: get().todos.filter(t => t.id !== id) });
                addToast('删除成功', 'success');

                apiDelete(id).catch(() => {
                    set({ offlineQueue: [...get().offlineQueue, { type: 'delete', todo }] });
                });
            },

            completeAll: () => {
                const original = [...get().todos];
                set({ todos: original.map(t => ({ ...t, completed: true })) });

                original.forEach(todo => {
                    if (!todo.completed) {
                        apiUpdate(todo.id, { completed: true }).catch(() => {
                            set(state => ({ offlineQueue: [...state.offlineQueue, { type: 'update', todo: { ...todo, completed: true } }] }));
                        });
                    }
                });

            },

            deleteAll: () => {
                const todosCopy = [...get().todos];
                set({ todos: [] });

                todosCopy.forEach(todo => {
                    apiDelete(todo.id).catch(() => {
                        set(state => ({ offlineQueue: [...state.offlineQueue, { type: 'delete', todo }] }));
                    });

                });
            },

            syncTodos: async () => {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.warn('⚠️ 未登录用户，无法同步 todos');
                    return;
                }
                const queue = get().offlineQueue;
                if (!queue.length) return;

                let updatedTodos = [...get().todos];
                const remainingQueue: OfflineAction[] = [];

                for (const action of queue) {
                    try {
                        if (action.type === 'add') {
                            const res = await apiAdd(action.todo.title, action.todo.deadline, action.todo.group, userId);
                            updatedTodos = updatedTodos.map(t => t.id === action.todo.id ? res : t);
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
            },
            // 登出时清除所有数据
            clearAll: () => set({ todos: [], offlineQueue: [] }),
        }),
        { name: 'todo-storage' }
    )
);
