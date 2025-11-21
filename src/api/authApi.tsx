// src/api/authApi.ts
import { supabase } from "../utils/supabaseClient";
import { generateJWT } from "../utils/jwt";
import type { AuthJWTPayload } from "../utils/jwt";

export interface LoginResponse {
    token: string;
    userId: string;
}

/**
 * 注册：插入 username + password 到 Supabase users 表
 */
export const register = async (username: string, password: string) => {
    const { data, error } = await supabase
        .from("users")
        .insert([{ username, password }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * 登录：校验密码并生成 JWT
 */
export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    // 查询用户
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !data) {
        throw new Error("用户不存在");
    }

    // 校验密码（明文）
    if (data.password !== password) {
        throw new Error("密码错误");
    }

    // ✨ 用真实 JWT 生成 Token
    const payload: AuthJWTPayload = {
        userId: data.id,
        username: data.username,
    };

    const token = await generateJWT(payload);

    return {
        token,
        userId: data.id,
    };
};
