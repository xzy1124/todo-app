// src/api/authApi.ts
import { supabase } from "../utils/supabaseClient";

interface LoginResponse {
    token: string;
    userId: string;
}

// 注册
export const register = async (username: string, password: string) => {
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, password }])
        .select()
        .single();

    if (error) throw error;

    return data; // 你原本 register 不需要 token，继续保持这样
};

// 登录（返回 token + userId）
export const login = async (username: string, password: string): Promise<LoginResponse> => {
    // 查用户
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !data) throw new Error("用户不存在");

    // 校验密码（明文版）
    if (data.password !== password) {
        throw new Error("密码错误");
    }

    // **生成假 token（模仿后端）**
    // 真实项目你可以用 JWT，但现在前端就能生成
    const token = btoa(`${data.id}:${Date.now()}`);

    // 返回你原本需要的格式
    return {
        token,
        userId: data.id,
    };
};
