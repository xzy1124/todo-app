// server.cjs
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// 解析请求体
server.use(jsonServer.bodyParser);
server.use(middlewares);

// 自定义 POST /login
server.post("/login", (req, res) => {
    const { username, password } = req.body;
    const db = router.db;
    const user = db.get("users").find({ username, password }).value();

    if (!user) {
        return res.status(401).json({ message: "用户名或密码错误" });
    }

    res.json({
        token: user.token,
        userId: user.id,
    });
});

// json-server 默认路由
server.use(router);

// 监听端口
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`JSON Server running on http://localhost:${PORT}`);
});
