import React from 'react'
import type { Todo } from '../types/todo';
//这是每一个待办事项的实现,其实是每条待办需要的外部输入
/**
 * 这个TodoItem组件的实现是有逻辑的，
 * 比如勾选的时候能通知父组件，我被勾选了，点击删除的时候我被删除了
 */
export interface TodoItemProps {
    todo: Todo; //需要一条待办对象，让子组件知道要显示哪一条待办
    onToggle: (id: number) => void; //切换事件，获取id作为参数，返回一个空函数
    onDelete: (id: number) => void; //删除事件，获取id作为参数，返回一个空函数
    //只传id,是用户点击之后我们传给父组件，父组件再用useState更新状态，调API
    // 子组件永远不修改全局数据，而是告诉父组件怎么改
}
const TodoItem: React.FC<TodoItemProps> = ({todo, onToggle, onDelete}) => {
    return (
        <div className='
            flex items-center justify-between
            p-3 rounded-lg
            bg-white shadow-sm
            border border-gray-200
            '
        >
            {/* 复选框，根据completed状态判断是否勾选,onChange事件触发切换事件,并传递id给父组件 */}
            <div className="flex items-center gap-3">

                <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    //为什么todo下面会有id这个属性，是因为它是Todo类型，Todo类型有id属性
                    onChange={() => onToggle(todo.id)} />
                <span 
                    className={`text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-700"}`}
                >
                    {todo.title}
                </span>
            </div>
            <button 
                onClick={() => onDelete(todo.id)}
                className='
                    text-sm text-red-500
                    hover: text-red-700
                    transition-colors
                '
            >
                删除
            </button>
        </div>
    )
}
export default TodoItem;