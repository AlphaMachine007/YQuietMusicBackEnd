const express = require('express');
// 创建 express 应用
const app = express();
// 引入wss
const wss = require('./utils/connectWebsocket');

// 统一引入routes
const routes = require('./routes');
const tokenTool = require('./utils/createToken');
// 解析token中间件
const expressJWT = require('express-jwt');
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(expressJWT({secret:tokenTool.secret}).unless({ path: [/^\/api\//] }))

// 中间件解决跨域问题
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
// const multipart = require('connect-multiparty')

app.use(bodyParser.json({limit:'10mb'}));
// 处理x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit:'10mb',extended: true }));
// 处理mutipart/form-data
// app.use(multipart())
// 处理application/json

routes(app);

// 使 express 监听 3001 端口号发起的 http 请求
const server = app.listen(3001, function () {
  console.log("服务器已启动，监听3001端口");
});
