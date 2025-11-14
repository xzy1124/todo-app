import React, { useState } from 'react';
import { login } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // 表单一提交触发的事件
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const res = await login(username, password);
            localStorage.setItem('token', res.data.token); //把token存在localStorage中
            localStorage.setItem('userId', res.data.userId.toString()); //把userId存在localStorage中
            // 登录成功后跳转到首页
            navigate('/');
        } catch (error) {
            console.log(error);
            alert('登录失败');
        }
    }
  return (
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        <input 
            type="text" 
            placeholder="用户名" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} />
        <input 
            type="password" 
            placeholder="密码" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">登录</button>
    </form>
  );
};
export default Login;