// 这是事项输入框的实现
import React from 'react'
//输入框的属性，有内容吧，
export interface TodoInputProps {
    onAdd: (title:string) => void; //新增事件获取标题作为参数，返回一个空函数
}
//TodoInput 是一个 React 函数组件,它的 props 类型是 TodoInputProps,它的参数是一个对象，我们从里面解构出 onAdd
const TodoInput: React.FC<TodoInputProps> = (props) => {
    const {onAdd} = props;
    return (
        <div>
            <input type="text" placeholder="请输入事项" />
            <button>添加</button>
        </div>
    )
}
export default TodoInput;