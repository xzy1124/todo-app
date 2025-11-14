import axios from 'axios';
// 创建axios实例
const axiosInstance = axios.create({
    baseURL: "http://localhost:3001",
    timeout: 5000,
})
// 配置请求拦截器
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
// 配置响应拦截器
axiosInstance.interceptors.response.use((response) => 
    response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem("token");
            window.location.href = "/login"
        }
        return Promise.reject(error);
    }
)
export default axiosInstance;