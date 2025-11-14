import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
// 左边参数解构等价于(props) => {
// const children = props.children;
// }
// 右边参数类型，是children必须是一个组件的JSX元素，这是入参类型不是函数的返回类型
const PrivateRoute = ({children} : {children: React.ReactNode}) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
}
export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                {/* 下面保护Home */}
                <Route 
                    path='/'
                    element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    )
}