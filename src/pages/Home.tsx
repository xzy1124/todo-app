import React, { useState, useEffect } from 'react'
import TodoList from '../components/TodoList';
import FilterBar from '../components/FilterBar';
import TodoInput from '../components/TodoInput';
import type { Todo } from '../types/todo';
//导入那些api方法
import { getTodo, addTodo, updateTodo, deleteTodo } from '../api/todoApi';
// 这是首页的实现，负责展示待办事项列表，过滤待办事项，添加待办事项
const Home: React.FC = () => {
    //添加一条待办事项的逻辑实现
    //定义一个状态存储待办事项的列表
    const [todos, setTodos] = useState<Todo[]>([]);
    //定义过滤状态
    const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
        //在home组件加一个input输入框，状态存一下
    const [search,setSearch] = useState('');
        //添加防抖实现
    const [debounceSearch,setDebounceSearch] = useState('');
    useEffect(() => {
        //创建一个函数，把搜索框的内容延迟300毫秒后赋值给debounceSearch
        const handle = setTimeout(() => {
            setDebounceSearch(search)
        }, 3000)
        return () => clearTimeout(handle)
    }, [search])
    
//页面一加载我们就请求api去拿数据
    useEffect(() => {
        // 发起查看所有待办事项的请求
        getTodo().then(res => setTodos(res.data));
    }, []);
    const handleAdd = async (title: string) => {
        // //创建一个新对象
        // const newTodo: Todo = {
        //     id: Date.now(),
        //     title, //title是用户输入的，是从TodoInput那里传过来的
        //     completed: false,
        // }
        const res = await addTodo(title)
        setTodos([res.data, ...todos]);
    }
    //切换待办状态的实现
    const handleToggle = async (id: number) => {
        //就是根据id找到待办事项，然后去切换completed的状态
        //如果里面有要处理的那个id项，就创建一个新对象：其他属性保持不变，completed 取反
        //我们先来找一下这个id吧
        const current = todos.find(item => item.id === id);
        if(!current) return
        const res = await updateTodo(id, { completed: !current.completed });
        //我们res的返回就是一个新的待办事项对象
        setTodos(todos.map(item => item.id === id ? res.data : item));
    }
    // 删除待办事项的实现
    const handleDelete = async (id: number) => {
        //找到那个id把它删去,返回一个新数组,是id不相等的项
        await deleteTodo(id);
        setTodos(todos.filter(item => item.id !== id));
    }
    //根据过滤状态展示待办的事项,是用来对todos待办数组进行筛选的
        //忽略大小写的搜索
    const normalizedSearch = debounceSearch.trim().toLowerCase();
    const filteredTodos = todos.filter(item => {
        // 父组件怎么知道是什么状态呢，因为父组件用来FilterBar组件，这个组件告诉父组件的，
        // 你点了哪个，就会把哪个状态传递给父组件的setFilter函数
        if(filter === 'active') return !item.completed;
        if(filter === 'completed') return item.completed;
        return true;
            // 再根据搜索框的内容进行筛选
    }).filter(item => item.title.toLowerCase().includes(normalizedSearch));
    console.log("即时输入 search:", search);
    console.log("防抖后 debounceSearch:", debounceSearch);

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center p-8'>
            <div className='w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8'>
                <h1 className='text-3xl font-bold text-center mb-6'>Todo App</h1>
                <TodoInput onAdd={handleAdd} />
                    {/* 这里展示过滤栏 */}
                        {/* 这里加一个输入框 */}
                <input 
                    type="text"
                    placeholder='搜索待办...'
                    className='w-full p-2 border rounded mb-4'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    
                />
                <FilterBar filter={filter} onChange={setFilter} />
                    {/* 这里展示待办事项列表,(根据过滤状态和搜索框的内容进行筛选,我搜什么就能出现什么) */}
                <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} />
            </div>
        </div>
    )
}
export default Home;
