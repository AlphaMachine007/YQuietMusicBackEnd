const express = require('express');
const chat = express();
const chatModel = require("../db/chatModel");
const tokenTool = require('../utils/createToken');
const authorize = require('../utils/authorizesTool');

// 建立私信
chat.post('/addChat', authorize.authorization, (req, res) => {
    chatModel.findOne({ $or: [{ 'userA.id': req.body.userA.id, 'userB.id': req.body.userB.id }, { 'userA.id': req.body.userB.id, 'userB.id': req.body.userA.id }] })
        .then(docs => {
            if (docs != null) {
                res.send({
                    state: 200,
                    msg: '建立连接'
                })
            } else {
                chatModel.create({ userA: req.body.userA, userB: req.body.userB })
                    .then(chat => {
                        res.send({
                            state: 200,
                            msg: '建立连接'
                        })
                    }).catch(err => {
                        res.send({
                            state: 401,
                            msg: '连接失败'
                        })
                    })
            }
        })
})
// 获取会话列表
chat.get('/getChatList', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            chatModel.find({ $or: [{ 'userA.id': result.data._id }, { 'userB.id': result.data._id }] })
                .then(docs => {
                    res.send({
                        state: 200,
                        msg: '获取成功',
                        data: docs
                    })
                }).catch(err => {
                    res.send({
                        state: 402,
                        msg: '获取失败'
                    })
                })
        }
    })
})
// 删除会话
chat.delete('/deleteChat/:chatId', (req, res) => {
    const chatId = req.params.chatId;
    chatModel.deleteOne({ _id: chatId })
        .then(docs => {
            if(docs.deletedCount == 1){
                res.send({
                    state:200,
                    msg:'删除成功'
                })
            }else{
                res.send({
                    state:403,
                    msg:'删除失败'
                })
            }
        }).catch(err => {
            res.send({
                state:401,
                msg:'删除失败',
                err
            })
        })
})
module.exports = chat;