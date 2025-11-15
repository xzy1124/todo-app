import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import TodoInput from '../components/TodoInput';
import { useTodoStore } from '../store/todoStore';
import Toast from '../common/toast/Toast';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { X } from 'lucide-react';
import TodoStats from './TodoStatus';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
    const isOnline = useNetworkStatus();

    const {
        todos,
        offlineQueue,
        fetchTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        completeAll,
        deleteAll,
        syncTodos,
    } = useTodoStore();

    // 搜索状态和防抖
    const [search, setSearch] = useState('');
    const [debounceSearch, setDebounceSearch] = useState('');
    useEffect(() => {
        const handle = setTimeout(() => setDebounceSearch(search), 300);
        return () => clearTimeout(handle);
    }, [search]);

    // 初始加载 todos
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // 定时离线同步
    useEffect(() => {
        const timer = setInterval(syncTodos, 5000);
        return () => clearInterval(timer);
    }, [syncTodos]);

    // 筛选 + 搜索 + 排序
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const normalizedSearch = debounceSearch.trim().toLowerCase();
    const filteredTodos = todos
        .filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        })
        .filter(todo => todo.title.toLowerCase().includes(normalizedSearch))
        .sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });

    // Toast 管理
    const [toasts, setToasts] = useState<{ id: number; message: string; type?: 'success' | 'error' | 'info' | 'warning' }[]>([]);

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center p-8'>
            {/* 网络状态 */}
            <div className="absolute top-4 right-4 text-sm font-medium">
                {isOnline ? '🌐 在线' : '📴 离线'}
                {offlineQueue.length > 0 && ` | 待同步 ${offlineQueue.length} 条`}
            </div>

            {/* 弹窗 */}
            <div className='fixed top-4 right-4 z-50 flex flex-col gap-2'>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={2000}
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    />
                ))}
            </div>

            <div className='w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8'>
                <TodoStats />
                <h1 className='text-3xl font-bold text-center mb-6'>Todo App</h1>

                {/* 输入框 */}
                <TodoInput
                    onAdd={(title, deadline, group) => {
                        addTodo(title, deadline, group);
                        setToasts(prev => [...prev, { id: Date.now(), message: '添加成功', type: 'success' }]);
                    }}
                />

                {/* 搜索 */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="搜索待办..."
                        className="w-full p-2 pr-10 border rounded"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                        >
                            <X size={17} className="text-gray-400 hover:text-black" />
                        </button>
                    )}
                </div>

                <FilterBar filter={filter} onChange={setFilter} />

                {/* 全部操作按钮 */}
                <div className="flex gap-3 mb-4">
                    <button onClick={completeAll} className="px-4 py-2 bg-green-500 text-gray-800 rounded-lg hover:bg-green-600">全部完成</button>
                    <button onClick={deleteAll} className="px-4 py-2 bg-red-500 text-gray-800 rounded-lg hover:bg-red-600">全部删除</button>
                </div>

                {/* Todo 列表 */}
                <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} searchTerm={debounceSearch} />
            </div>
        </div>
    );
};

export default Home;
