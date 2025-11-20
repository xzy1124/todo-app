// src/pages/Login.tsx
import React, { useState } from 'react';
import { login } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(username, password);
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.userId);
            navigate('/');
        } catch (error) {
            console.log(error);
            alert('登录失败');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-lg w-80 flex flex-col gap-4"
            >
                <h2 className="text-2xl font-bold text-center mb-4">登录</h2>
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
                <button
                    type="submit"
                    className="bg-blue-500 text-gray-800 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    登录
                </button>
                <button
                    type="button"
                    // 点击注册按钮就跳转到注册页面，只跳转不考虑逻辑
                    onClick={() => navigate('/register')}
                    className="bg-green-500 text-gray-800 py-2 rounded hover:bg-green-600 transition-colors"
                >
                    注册
                </button>

            </form>
        </div>
    );
};

export default Login;
