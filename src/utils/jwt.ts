// src/utils/jwt.ts
import { SignJWT, jwtVerify } from "jose";

/**
 * 注意：生产环境请把密钥放在环境变量中 (VITE_JWT_SECRET)，
 * 且前端暴露 secret 是不安全的。此方案适合学习/Demo。
 */
const RAW_SECRET = import.meta.env.VITE_JWT_SECRET ?? "yanbao_dev_secret";
const SECRET_KEY = new TextEncoder().encode(RAW_SECRET);

/**
 * 使用不同的接口名，避免与 jose 的类型冲突。
 * 扩展 Record<string, unknown> 以满足 SignJWT 的要求
 */
export interface AuthJWTPayload extends Record<string, unknown> {
    userId: string;
    username: string;
}

/**
 * 生成 JWT（HS256）
 */
export async function generateJWT(payload: AuthJWTPayload): Promise<string> {
    // SignJWT 接受的 payload 需要满足带索引签名的对象类型，
    // 这里我们把 payload 断言为 Record<string, unknown> 保证类型兼容性。
    return await new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET_KEY);
}

/**
 * 验证并返回解出的 payload（若无效返回 null）
 */
export async function verifyJWT(token: string): Promise<AuthJWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        // jose 返回的 payload 是通用对象，这里断言为我们定义的类型
        return payload as AuthJWTPayload;
    } catch {
        return null;
    }
}
