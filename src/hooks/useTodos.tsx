import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo';
import { getTodo, addTodo, updateTodo, deleteTodo } from '../api/todoApi';

export interface OfflineAction {
    type: 'add' | 'update' | 'delete';
    todo: Todo;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
    const [search, setSearch] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);
    //添加弹窗提示
    const [toastMessage, setToastMessage] = useState('');
    const [showToast,setShowToast] = useState(false);

    // 🔹 搜索防抖
    useEffect(() => {
        const handle = setTimeout(() => setDebounceSearch(search), 300);
        return () => clearTimeout(handle);
    }, [search]);

    // 🔹 页面加载：先读 localStorage，再尝试从服务器更新
    useEffect(() => {
        const localTodos = localStorage.getItem('todos');
        if (localTodos) {
            const parsed = JSON.parse(localTodos);
            if (parsed.length > 0) setTodos(parsed);
        }

        getTodo()
            .then(res => {
                setTodos(res.data);
                localStorage.setItem('todos', JSON.stringify(res.data));
            })
            .catch(err => console.warn('⚠️ 服务器不可用，使用本地缓存', err));
    }, []);

    // 🔹 更新 state + localStorage
    const updateTodos = (newTodos: Todo[] | ((prev: Todo[]) => Todo[])) => {
        setTodos(prev => {
            const updated = typeof newTodos === 'function' ? newTodos(prev) : newTodos;
            localStorage.setItem('todos', JSON.stringify(updated));
            return updated;
        });
    };

    // 🔹 离线队列同步
    // 使用 useCallback 缓存 syncOfflineQueue 函数
    const syncOfflineQueue = useCallback(async () => {
        if (offlineQueue.length === 0) return;

        console.log('🔄 尝试同步离线操作：', offlineQueue);

        let newTodos = [...todos];
        const remainingQueue: OfflineAction[] = [];

        for (const action of offlineQueue) {
            try {
                if (action.type === 'add') {
                    const res = await addTodo(action.todo.title);
                    // 替换临时 todo
                    newTodos = newTodos.map(todo =>
                        todo.id === action.todo.id ? res.data : todo
                    );
                } else if (action.type === 'update') {
                    await updateTodo(action.todo.id, { completed: action.todo.completed });
                } else if (action.type === 'delete') {
                    await deleteTodo(action.todo.id);
                    newTodos = newTodos.filter(todo => todo.id !== action.todo.id);
                }
            } catch (err) {
                console.warn('⚠️ 同步失败，保留操作', action, err);
                remainingQueue.push(action);
            }
        }

        updateTodos(newTodos);
        setOfflineQueue(remainingQueue);
    }, [offlineQueue, todos]); // 添加所有依赖项

    // 定时同步（每 5 秒尝试一次）
    useEffect(() => {
        const timer = setInterval(syncOfflineQueue, 5000);
        return () => clearInterval(timer);
    }, [syncOfflineQueue]); // 现在只需要依赖 syncOfflineQueue

    // 🔹 添加待办
    const handleAdd = (title: string) => {
        const tempId = Date.now();
        const newTodo: Todo = { id: tempId, title, completed: false };

        updateTodos(prev => [newTodo, ...prev]);

        addTodo(title)
            .then(res => {
                updateTodos(prev =>
                    prev.map(todo => (todo.id === tempId ? res.data : todo))
                );
            })
            .catch(() =>
                setOfflineQueue(prev => [...prev, { type: 'add', todo: { ...newTodo } }])
            );
    };

    // 🔹 切换完成状态
    const handleToggle = (id: number) => {
        updateTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );

        const current = todos.find(t => t.id === id);
        if (!current) return;

        updateTodo(id, { completed: !current.completed })
            .catch(() =>
                setOfflineQueue(prev => [
                    ...prev,
                    { type: 'update', todo: { ...current, completed: !current.completed } }
                ])
            );
    };

    // 🔹 删除待办
    const handleDelete = (id: number) => {
        const current = todos.find(t => t.id === id);
        if (!current) return;

        // 立即在本地删除
        updateTodos(prev => prev.filter(todo => todo.id !== id));

        deleteTodo(id)
            .then(() => console.log(`✅ 已删除服务器上的 todo #${id}`))
            .catch(() => {
                console.warn('⚠️ 删除失败，加入离线队列');
                setOfflineQueue(prev => [
                    ...prev,
                    { type: 'delete', todo: { ...current } }
                ]);
            });
        // 添加弹窗提示
        setToastMessage('拜拜咯');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // 🔹 筛选 + 搜索
    const normalizedSearch = debounceSearch.trim().toLowerCase();
    const filteredTodos = todos
        .filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        })
        .filter(todo => todo.title.toLowerCase().includes(normalizedSearch));

    return {
        todos: filteredTodos,
        filter,
        setFilter,
        search,
        toastMessage,
        showToast,
        setSearch,
        handleAdd,
        handleToggle,
        handleDelete,
        offlineQueue,
    };
};
