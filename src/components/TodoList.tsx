import React from 'react'
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';
// 这是待办事项列表的实现，一是能展示多个待办，而是能根据状态过滤展示
export interface TodoListProps {
    todos: Todo[]; //需要一个待办数组，让子组件知道要显示哪些待办
    onToggle: (id: number) => void; //切换事件，获取id作为参数，返回一个空函数
    onDelete: (id: number) => void; //删除事件，获取id作为参数，返回一个空函数
    searchTerm?: string; //搜索关键词
}
const TodoList: React.FC<TodoListProps> = ({todos, onToggle, onDelete, searchTerm}) => {
    return (
        <div className='bg-white rounded-xl shadow p-4 mt-6'>
            {todos.length === 0 ? (
                <p className='text-center text-gray-400 py-6'>暂无待办事项</p>
            ) : (
                // 每个待办项之间有一个分隔线,相当于hr标签
                <div className='divide-y'>
                    {todos.map((todo) => (
                        <div key={todo.id} className='py-3'>
                            <TodoItem
                                todo={todo}
                                onToggle={onToggle}
                                onDelete={onDelete}
                                searchTerm={searchTerm}
                            />
                        </div>
                    ))}
                </div>
            )}
            {/* 因为能展示多个待办，所以能map待办数组中的每个待办，然后渲染一个TodoItem组件 */}
            {/* {todos.map(todo => (
                // 按照TodoItem的props,传递todo,切换事件,删除事件
                <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
            ))} */}
        </div>
    )
}
export default TodoList;