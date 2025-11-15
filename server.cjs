const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const SECRET_KEY = "yanbao_smallyan_secret"; // JWT 密钥
const EXPIRES_IN = "1h"; // 1 小时过期

app.use(cors());
app.use(bodyParser.json());

// ---- JSON 文件数据库封装 ----
const load = (file) => JSON.parse(fs.readFileSync(`./data/${file}`));
const save = (file, data) => fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));

let users = load("users.json");
let todos = load("todos.json");

// ---- JWT 鉴权中间件 ----
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token expired or invalid" });
        req.user = decoded;
        next();
    });
}
// ----注册接口 ----
app.post('/register', async (req, res) => {
    try {
        // 这就是从前端注册页面提交的用户名和密码取出来做判断
        const {username, password} = req.body
        if(!username || !password){
            return res.status(400).json({message: "用户名或密码不能为空"})
        }
        const exists = users.find(u => u.username === username)
        if(exists){
            return res.status(400).json({message: "用户名已存在"})
        }
        // 为新用户分配一个唯一的ID,从已有的用户对象id中取出一个最大的加1，要是没有就直接id为1
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const hashed = await bcrypt.hash(password, 10) //这里的10是盐的长度，盐的长度越大，加密的结果就越复杂
        // 把新对象整合一下，包括id，用户名，密码
        const newUser = {
            id: newId,
            username,
            password: hashed
        }
        users.push(newUser)
        save("users.json", users)
        res.status(201).json({message: "注册成功"})
    }catch (err) {
        console.error(err)
        res.status(500).json({message: "服务器内部错误"})
    }
})
// ---- 登录接口 ----
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) return res.status(400).json({ message: "用户不存在" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "密码错误" });

        const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: EXPIRES_IN });
        res.json({ token, userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "服务器内部错误" });
    }
});

// ---- 获取用户 TODO ----
app.get("/todos", auth, (req, res) => {
    const userTodos = todos.filter(t => t.userId === req.user.userId);
    res.json(userTodos);
});

// ---- 添加 TODO ----
app.post("/todos", auth, (req, res) => {
    // 从前端请求体中取出 title 和 group 和 deadline
    const {title, deadline, group} = req.body;
    const newTodo = {
        id: Date.now().toString(),
        title,
        completed: false,
        userId: req.user.userId,
        deadline: deadline || null,
        group: group || "other"
    };
    todos.push(newTodo);
    save("todos.json", todos);
    res.json(newTodo);
});

// ---- 更新 TODO ----
app.patch("/todos/:id", auth, (req, res) => {
    const id = req.params.id; // 字符串
    const t = todos.find(todo => todo.id.toString() === id && todo.userId === req.user.userId);
    if (!t) return res.status(404).json({ message: "Todo not found" });

    Object.assign(t, req.body);
    save("todos.json", todos);
    res.json(t);
});

// ---- 删除 TODO ----
app.delete("/todos/:id", auth, (req, res) => {
    const id = req.params.id; // 字符串
    todos = todos.filter(t => !(t.id.toString() === id && t.userId === req.user.userId));
    save("todos.json", todos);
    res.json({ message: "Deleted" });
});


// ---- 启动服务器 ----
app.listen(3001, () => console.log("Server running at http://localhost:3001"));
