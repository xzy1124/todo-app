import type { Todo } from '../types/todo'
import axiosInstance from '../utils/axiosInstance'
//定义基准路径，都以这个开头
const API_URL = '/todos'
//获取所有事项
export const getTodo = () => axiosInstance.get<Todo[]>(API_URL)
//添加事项,添加title和completed属性
export const addTodo = (title: string, deadline?: string, group?: string) => 
    axiosInstance.post<Todo>(API_URL, 
        { title, completed: false, deadline, group })
//修改，要根据id修改,修改之后的数据还是个待办事项的对象
export const updateTodo = (id: string, data: Partial<Todo>) => 
    axiosInstance.patch<Todo>(`${API_URL}/${id}`, data)
// 删除，也是一样的根据id，但是应该不需要返回新对象了
export const deleteTodo = (id: string) => 
    axiosInstance.delete(`${API_URL}/${id}`)
// 这里的API-URL也用模板字符串是因为统一规范
// axios.patch(url, body) 这种写法是 axios 规范，不是语法规定。
// 它的作用是部分更新资源，而不是整体替换。
// 所以，在使用 axios 发送 PATCH 请求时，需要将需要更新的属性和值封装在 body 中。
// 例如，要将 id 为 1 的待办事项的 completed 属性设置为 true，需要发送如下请求：
// axios.patch(`${API_URL}/1`, { completed: true })
// Partial<Todo> 是一个类型，它表示 Todo 类型的所有属性都是可选的。
// 所以，在使用 updateTodo 函数时，只需要传递需要更新的属性和值即可。
// 例如，要将 id 为 1 的待办事项的 title 设置为 'Buy groceries'，可以这样调用：
// updateTodo(1, { title: 'Buy groceries' })