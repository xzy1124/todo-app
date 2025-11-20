import { useNavigate } from 'react-router-dom';
import { useTodoStore } from '../store/todoStore';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // 清空 todos & 离线队列
        useTodoStore.getState().clearAll();

        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="text-red-500">
            登出
        </button>
    );
}
