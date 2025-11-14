// server.cjs
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const SECRET = "your_jwt_secret_here"; // 可换成更安全的随机值

app.use(cors());
app.use(bodyParser.json());

// ---- 简单文件数据库封装 ----
const load = (file) => JSON.parse(fs.readFileSync(`./data/${file}`));
const save = (file, data) => fs.writeFileSync(`./data/${file}`, JSON.stringify(data, null, 2));

// ---- 读取数据库 ----
let users = load("users.json");
let todos = load("todos.json");

// ---- JWT 鉴权中间件 ----
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token expired or invalid" });
        req.user = decoded;
        next();
    });
}

// ---- 注册 ----
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "Username exists" });
    }

    const hashed = bcrypt.hashSync(password, 8);
    const newUser = { id: Date.now(), username, password: hashed };

    users.push(newUser);
    save("users.json", users);

    res.json({ message: "Registered" });
});

// ---- 登录 ----
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

// ---- 获取 TODO ----
app.get("/todos", auth, (req, res) => {
    const userTodos = todos.filter(t => t.userId === req.user.id);
    res.json(userTodos);
});

// ---- 新增 TODO ----
app.post("/todos", auth, (req, res) => {
    const newTodo = {
        id: Date.now(),
        text: req.body.text,
        completed: false,
        userId: req.user.id
    };

    todos.push(newTodo);
    save("todos.json", todos);

    res.json(newTodo);
});

// ---- 修改 TODO ----
app.put("/todos/:id", auth, (req, res) => {
    const id = Number(req.params.id);
    const t = todos.find(todo => todo.id === id);

    if (!t || t.userId !== req.user.id)
        return res.status(404).json({ message: "Todo not found" });

    t.completed = req.body.completed;
    save("todos.json", todos);

    res.json(t);
});

// ---- 删除 TODO ----
app.delete("/todos/:id", auth, (req, res) => {
    const id = Number(req.params.id);
    todos = todos.filter(t => !(t.id === id && t.userId === req.user.id));
    save("todos.json", todos);
    res.json({ message: "Deleted" });
});

// ---- 启动服务器 ----
app.listen(3001, () => console.log("Server running at http://localhost:3001"));
