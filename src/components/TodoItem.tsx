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
        // 添加高亮逻辑，这是作用在item身上的，所以它应当有这个属性
    searchTerm?: string  //搜索关键词
}
const TodoItem: React.FC<TodoItemProps> = ({todo, onToggle, onDelete, searchTerm = ""}) => {
    // 实现高亮函数
    const highlightTitle = (title: string, searchTerm: string) => {
        if(!searchTerm) return title; //如果没有搜索关键词，直接返回标题
        const regex = new RegExp(`(${searchTerm})`, "gi"); //动态创建正则表达式，全局，不区分大小写
        // split遇到带有括号的正则表达式，会把括号里的内容也分出来
        return title.split(regex).map((part, index) => {
            return regex.test(part) ? (
                <mark
                    key={index}
                    className='bg-yellow-200 dark:bg-yellow-500 text-black dark:text-white px-1 rounded'>
                        {part}
                </mark>
            ) : (
                part
            )
        })
    }
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
                    {/* 一开始searchTerm可以是空的也就是undefined,所以我们给了初始值 */}
                    {highlightTitle(todo.title, searchTerm)} 
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