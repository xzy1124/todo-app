import axiosInstance from '../utils/axiosInstance'
interface LoginResponse {
    token: string;
    userId: number
}
export const login = (username: string, password: string) => {
    return axiosInstance.post<LoginResponse>("/login",{
        username,
        password
    })
}
