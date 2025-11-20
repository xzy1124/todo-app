// src/api/todoApi.ts
import type { Todo } from '../types/todo';
import { supabase } from '../utils/supabaseClient';

// 获取所有 todos，拿到的是当前用户的 todos
export const getTodo = async (userId: string): Promise<Todo[]> => {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data || [];
};


// 添加 todo,一定要确保user_id绑定到当前用户
export const addTodo = async (title: string, deadline?: string, group?: string, userId?: string): Promise<Todo> => {
    const { data, error } = await supabase
        .from('todos')
        .insert([{ title, completed: false, deadline, group, user_id: userId }])
        .select()
        .single();

    if (error) throw error;
    return data as Todo;
};


// 更新 todo
export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    // 不需要再处理字段名映射
    const { data, error } = await supabase
        .from('todos') // 移除泛型参数
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Todo; // 使用类型断言
};

// 删除 todo
export const deleteTodo = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
    if (error) throw error;
};