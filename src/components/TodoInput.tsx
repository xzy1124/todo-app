// 这是事项输入框的实现
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
//输入框的属性，有内容吧，
export interface TodoInputProps {
    onAdd: (title:string, deadline?: string, group?: string) => void; //新增事件获取标题作为参数，返回一个空函数
}
//TodoInput 是一个 React 函数组件,它的 props 类型是 TodoInputProps,它的参数是一个对象，我们从里面解构出 onAdd
const TodoInput: React.FC<TodoInputProps> = (props) => {
    const {onAdd} = props;
    //定义状态管理标题
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [group, setGroup] = useState('other');
    //实现点击添加事件
    const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //我一点击按钮的添加之后，trim是移除字符串两边的空格，
        // 如果标题为空，就不调用新增事件，也不清空标题
        if(!title.trim()) return;
        //调用新增事件,并传递标题,传到父组件那里去了
        onAdd(title, deadline || undefined, group);
        //清空标题
        setTitle('');
        //清空截止时间
        setDeadline('');
    }
    const [open, setOpen] = useState(false);
    return (
        <form onSubmit={handleAdd} className="flex gap-3 mb-4">
            <input 
                // 只要输入框一变化，我们就拿到e事件的value值放进title状态里
                // 添加value={title}.这时候的输入框就是一个受控组件，显示值由title状态控制
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Add a new todo..."
            />
            {/* 新增截至时间的输入 */}
            <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                // 选择onBlur事件，当输入框失去焦点时触发
                onBlur={(e) => setDeadline(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {/* 新增分类的下拉框选择 */}
            <div className="relative w-40">
                {/* 模拟下拉框头 */}
                <div
                    className="border px-3 py-2 rounded cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    {group || 'Select group'}
                </div>

                {/* 下拉列表 */}
                <AnimatePresence>
                    {open && (
                        <motion.ul
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute w-full bg-white border rounded shadow-md mt-1 overflow-hidden"
                        >
                            {['work', 'personal', 'food', 'travel', 'sport', 'study', 'other'].map(g => (
                                <li
                                    key={g}
                                    className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => { setGroup(g); setOpen(false); }}
                                >
                                    {g}
                                </li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Add
            </button>
        </form>
    );
}
export default TodoInput;