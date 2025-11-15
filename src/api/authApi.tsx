import axiosInstance from '../utils/axiosInstance'
interface LoginResponse {
    token: string;
    userId: number
}
export const login = (username: string, password: string) => {
    // 这里是因为login要用返回的类型，要用token去localStorage存储，要用userId存储
    return axiosInstance.post<LoginResponse>("/login",{
        username,
        password
    })
}
export const register = (username: string, password: string) => {
    // 表示向服务器发送注册请求，路径为/register，请求体为{username, password}也就是数据
    return axiosInstance.post('/register', {
        username,
        password
    })
}
