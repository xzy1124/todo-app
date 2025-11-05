import React, { useState } from 'react'
import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import TodoInput from '../components/TodoInput';
import type { Todo } from '../types/todo';
// 这是首页的实现，负责展示待办事项列表，过滤待办事项，添加待办事项
const Home: React.FC = () => {
    //添加一条待办事项的逻辑实现
    //定义一个状态存储待办事项的列表
    const [todos, setTodos] = useState<Todo[]>([]);
    //定义过滤状态
    const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
    const handleAdd = (title: string) => {
        //创建一个新对象
        const newTodo: Todo = {
            id: Date.now(),
            title, //title是用户输入的，是从TodoInput那里传过来的
            completed: false,
        }
        setTodos([...todos, newTodo]);
    }
    //切换待办状态的实现
    const handleToggle = (id: number) => {
        //就是根据id找到待办事项，然后去切换completed的状态
        //如果里面有要处理的那个id项，就创建一个新对象：其他属性保持不变，completed 取反
        setTodos(todos.map(item => item.id === id ? {...item, completed: !item.completed} : item));
    }
    // 删除待办事项的实现
    const handleDelete = (id: number) => {
        //找到那个id把它删去,返回一个新数组,是id不相等的项
        setTodos(todos.filter(item => item.id !== id));
    }
    //根据过滤状态展示待办的事项,是用来对todos待办数组进行筛选的
    const filteredTodos = todos.filter(item => {
        // 父组件怎么知道是什么状态呢，因为父组件用来FilterBar组件，这个组件告诉父组件的，
        // 你点了哪个，就会把哪个状态传递给父组件的setFilter函数
        if(filter === 'active') return !item.completed;
        if(filter === 'completed') return item.completed;
        return true;
    })
    return (
        <div>
            <h1>Todo App</h1>
            <TodoInput onAdd={handleAdd} />
                {/* 这里展示过滤栏 */}
            <FilterBar filter={filter} onChange={setFilter} />
                {/* 这里展示待办事项列表 */}
            <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} />
        </div>
    )
}
export default Home;
