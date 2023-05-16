// 引入websocket
const WebSocket = require('ws');
// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });
// 引入数据库
const chatModel = require("../db/chatModel");
// 存储标识与连接之间的映射关系
const connections = new Map();

const url = require('url');
// 监听连接事件
wss.on('connection', (ws, req) => {
  // 获取客户端表示
  const queryObject = url.parse(req.url, true).query;
  const clientId = queryObject.clientId;
  // 将新连接加入映射
  connections.set(clientId, ws);

  console.log('ws已连接在8080');
  ws.on('message', (message) => {
    let [toClientId, content] = Buffer.from(message).toString().split('|#');
    const toWs = connections.get(toClientId);
    console.log(toClientId, content);
    const contentObj = JSON.parse(content);
    chatModel.findOne({ $or: [{ 'userA.id': clientId, 'userB.id': toClientId }, { 'userA.id': toClientId, 'userB.id': clientId }] }, { userA: 0, userB: 0 })
      .then(docs => {
        if (docs.messageContent.length > 0) {
          console.log(docs.messageContent.slice(-1)[0]);
          if (contentObj.time - docs.messageContent.slice(-1)[0].time >= 90000) {
            contentObj.isShowTime = true;
            content = JSON.stringify(contentObj);
          }
        }else{
          contentObj.isShowTime = true;
        }
        chatModel.updateOne({ $or: [{ 'userA.id': clientId, 'userB.id': toClientId }, { 'userA.id': toClientId, 'userB.id': clientId }] }, { $push: { 'messageContent': contentObj } })
          .then(docs => {
            console.log(docs);
          }).catch(err => {
            console.log(err);
          })
      }).catch(err => {
        console.log(err);
      })

    if (toWs) {
      toWs.send(`${content}`)
      ws.send(`${content}`)
    } else {
      ws.send(`${content}`);
    }
  });
  // 监听关闭事件
  ws.on('close', () => {
    // 从连接集合中移除断开
    connections.delete(clientId);
    console.log('ws断开连接')
  })
})

module.exports = wss;