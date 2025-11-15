import React, { useState } from "react";
import { useTodos } from "../hooks/useTodos";

const TodoStats: React.FC = () => {
    const { todos, handleAdd } = useTodos(); // ❌ 注意这里是 useTodos
    const [newTitle, setNewTitle] = useState("");

    const handleAddClick = () => {
        if (!newTitle) return;
        handleAdd(newTitle);
        setNewTitle("");
    };

    return (
        <div className="p-4 border rounded mb-4 bg-gray-50">
            <h2 className="text-lg font-bold mb-2">Todo Stats (实验用)</h2>
            <p>未完成任务数: {todos.filter(t => !t.completed).length}</p>
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="添加新任务"
                className="border px-2 py-1 mr-2 rounded"
            />
            <button
                onClick={handleAddClick}
                className="bg-blue-500 text-gray-800 px-2 py-1 rounded hover:bg-blue-600"
            >
                添加
            </button>
        </div>
    );
};

export default TodoStats;
