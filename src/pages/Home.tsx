import React from 'react'
import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import TodoInput from '../components/TodoInput';
// 这是首页的实现，负责展示待办事项列表，过滤待办事项，添加待办事项
const Home: React.FC = () => {
    // 先展示一个纯ui
    return (
        <div>
            <h1>Todo App</h1>
            <TodoInput onAdd={() => {}} />
                {/* 这里展示过滤栏 */}
            <FilterBar filter='all' onChange={() => {}} />
                {/* 这里展示待办事项列表 */}
            <TodoList todos={[]} onToggle={() => {}} onDelete={() => {}} />
        </div>
    )
}
export default Home;
