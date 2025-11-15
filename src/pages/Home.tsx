import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import TodoInput from '../components/TodoInput';
import {useTodos} from '../hooks/useTodos';
import Toast from '../common/toast/Toast';
import {useNetworkStatus} from '../hooks/useNetworkStatus';
import { X } from "lucide-react";
const Home: React.FC = () => {
    const {
        //这样todos拿到的就是排好序的数组
        todos,
        filter,
        setFilter,
        search,
        toasts,
        setToasts,
        setSearch,
        handleAdd,
        offlineQueue,
        handleToggle,
        handleDelete,
        handleAllComplete,
        handleAllDelete,
    } = useTodos();
    const isOnline = useNetworkStatus();
    return (
        <div className='min-h-screen bg-gray-100 flex justify-center p-8'>
            {/* 状态栏 */}
            <div className="absolute top-4 right-4 text-sm font-medium">
                {isOnline ? '🌐 在线' : '📴 离线'}
                {offlineQueue.length > 0 && ` | 待同步 ${offlineQueue.length} 条`}
            </div>
            {/* 弹窗提示 */}
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
                <h1 className='text-3xl font-bold text-center mb-6'>Todo App</h1>
                <TodoInput onAdd={handleAdd} />
                {/* 这里加一个输入框 */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="搜索待办..."
                        className="w-full p-2 pr-10 border rounded"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
            
                {/* 这里展示过滤栏 */}
                <FilterBar filter={filter} onChange={setFilter} />
                {/* 这里展示全部完成或者全部删除的按钮吧 */}
                <div className="flex gap-3 mb-4">
                    <button onClick={handleAllComplete} className="px-4 py-2 bg-green-500 text-gray-800 rounded-lg hover:bg-green-600">
                        全部完成
                    </button>
                    <button onClick={handleAllDelete} className="px-4 py-2 bg-red-500 text-gray-800 rounded-lg hover:bg-red-600">
                        全部删除
                    </button>
                </div>
                    {/* 这里展示待办事项列表,(根据过滤状态和搜索框的内容进行筛选,我搜什么就能出现什么) */}
                <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} searchTerm={search} />
            </div>
        </div>
    )
}
export default Home;
