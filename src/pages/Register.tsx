import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
const Register = () => {
    // 获取用户名密码我们最好用受控绑定
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('两次密码不一致');
            return;
        }
        try {
            await register(username, password);
            alert('注册成功');
            navigate('/login');
        } catch (error) {
            console.log(error);
            alert('注册失败');
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-lg shadow-lg w-80 flex flex-col gap-4"
            >
                <h2 className="text-2xl font-bold text-center mb-4">注册</h2>

                <input
                    type="text"
                    placeholder="用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    placeholder="确认密码"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    className="bg-green-500 text-gray-800 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    注册
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-500 hover:underline text-center"
                >
                    返回登录
                </button>
            </form>
        </div>
    );
}
export default Register
