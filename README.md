# 🚀 **Todo App —— 基于 React + Zustand + Supabase + Express 的个人待办系统**

一个从 0 到 1 独立设计与开发的全栈 Todo 应用。
项目包含前端组件化开发、全局状态管理、自定义 Hook、JWT 登录系统、以及 Supabase 云数据库的整合。
适合作为全栈能力展示项目，也能扩展成完整的通用 CRUD 系统。线上展示：https://todo-app-mu-three-63.vercel.app/

---

## 🧩 **技术栈（Tech Stack）**

### **Frontend**

* React 19
* Zustand（全局状态管理）
* TailwindCSS
* Vite
* Lucide-react（图标）
* Framer Motion（动画）
* Custom Hook（useNetworkStatus）

### **Backend**

* Node.js + Express
* JSON 文件模拟数据库（初版）
* JWT 用户认证
* Bcrypt 密码加密
* Supabase Database（Todo 增删改查）

### **Deployment**

* Vercel（前端）
* Supabase Cloud
* 本地 Node（开发环境）

---

## 📦 **功能列表（Features）**

### ✔ 用户系统（Express）

* 用户注册（username + password）
* 用户登录
* JWT 认证
* LocalStorage 保存 token

### ✔ Todo 管理（Supabase）

* 添加 Todo
* 删除 Todo
* 修改 Todo
* 完成状态切换
* 批量全部完成
* 根据状态筛选：All / Active / Completed

### ✔ 离线增强（Offline Support）

* 自动检测在线 / 离线
* 离线时 Todo 操作加入 offlineQueue
* 网络恢复后自动同步任务

### ✔ UI/UX

* 全局 Toast 系统
* 动画过渡（Framer Motion）
* 自适应布局

---

## 🔧 **业务逻辑（从 0 到 1 演进）**

### **阶段 1：初版后端（Express + JSON 文件）**

* 用户注册、登录、JWT、加密逻辑全部自建
* todos 读写 JSON 文件
* 后来遇到并发写入导致数据丢失问题

### **阶段 2：升级到 Supabase（Todos 数据层）**

* 把 todos 的 CRUD 迁移到 Supabase
* Express 只保留用户系统
* Todo 表新增 `user_id` 外键（从 JWT 中获取）
* 使用 Supabase SDK 完成数据操作

### **阶段 3：前端优化**

* 引入 Zustand 管理 todos & toast
* 构建 offlineQueue
* 添加 useNetworkStatus
* 做了乐观更新（先更新 UI，再更新后端）

---


## ▶️ **本地运行（Local Development）**

### 1. 启动后端

```bash
node server.cjs
```

### 2. 启动前端

```bash
npm install
npm run dev
```

前端默认运行在：

```
http://localhost:5173
```

---

## 🚀 **部署（Deployment）**

### 1. Vercel 部署前端

* 连接 GitHub 仓库
* 配置环境变量
* 自动构建

### 2. Supabase 托管数据库

* 创建 todos 表
* 配置 RLS
* 复制 URL/KEY 到 `.env`

---

## 📝 **数据库结构（Supabase）**

**todos 表：**

| 字段名        | 类型        | 说明       |
| ---------- | --------- | -------- |
| id         | text      | 主键（前端生成） |
| title      | text      | Todo 内容  |
| completed  | bool      | 完成状态     |
| deadline   | timestamptz  | 截止时间  |
| priority   | text      |  优先级      |
| user_id    | text      | 所属用户     |
| created_at | timestamp | 自动创建     |

---


## ❤️ 作者

项目由 **Yanbao（言宝）** 设计与开发。
如有建议或想继续优化欢迎提出 issue。

---


