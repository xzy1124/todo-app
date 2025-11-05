import React from 'react'
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';
// 这是待办事项列表的实现，一是能展示多个待办，而是能根据状态过滤展示
export interface TodoListProps {
    todos: Todo[]; //需要一个待办数组，让子组件知道要显示哪些待办
    onToggle: (id: number) => void; //切换事件，获取id作为参数，返回一个空函数
    onDelete: (id: number) => void; //删除事件，获取id作为参数，返回一个空函数
}
const TodoList: React.FC<TodoListProps> = ({todos, onToggle, onDelete}) => {
    return (
        <div>
            {/* 因为能展示多个待办，所以能map待办数组中的每个待办，然后渲染一个TodoItem组件 */}
            {todos.map(todo => (
                // 按照TodoItem的props,传递todo,切换事件,删除事件
                <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
            ))}
        </div>
    )
}
export default TodoList;