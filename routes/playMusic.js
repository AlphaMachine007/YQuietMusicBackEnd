const express = require('express');

const playMusic = express();
const connectMusic = require('../config/connectMusic');
const authorize = require('../utils/authorizesTool');
const axios = require('axios')

// 获取游客cookie
playMusic.get('/getVisitorCookie', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/register/anonimous`);
})
// 获取登录状态
playMusic.post('/getLoginStatus', (req, res) => {
    axios.post(`${connectMusic.musicURL}/login/status?cookie=${req.body.cookie}&timestamp=${Date.now()}`, req.body.cookie)
        .then(response => {
            res.send(response.data.data);
        })
        .catch(err => {
            res.send(err);
        })
})
// 获取生成二维码的key
playMusic.get('/getLoginUnikey', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/login/qr/key?timestamp=${Date.now()}`);
})
// 生成二维码
playMusic.post('/getQRCode', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/login/qr/create?key=${req.body.key}&qrimg=true&timestamp=${Date.now()}`)
})
// 检测二维码状态接口
playMusic.post('/checkStatus', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/login/qr/check?key=${req.body.key}&timestamp=${Date.now()}`);
})
// 退出登录
playMusic.post('/logoutCloud', (req, res) => {
    axios.post(`${connectMusic.musicURL}/logout`, req.body.cookie)
        .then(response => {
            res.send(response.data);
        })
        .catch(err => {
            res.send(err);
        })
})
// 通过歌曲id获取歌曲详情
playMusic.post('/getMusicDetailById',(req,res)=>{
    res.redirect(`${connectMusic.musicURL}/song/detail?ids=${req.body.songId}`);
})
// 获取云账户歌单
playMusic.post('/getCloudPlayList', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/user/playlist?uid=${req.body.uid}`);
})
// 获取歌曲url
playMusic.post('/getMusicUrl', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/song/url/v1?id=${req.body.musicId}&level=${req.body.level}`);
})
// 获取取词
playMusic.post('/getLyric', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/lyric?id=${req.body.id}`);
})
// 获取云歌单详情
playMusic.post('/getSheetDetail', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/playlist/detail?id=${req.body.sheetId}`);
})
// 获取云歌单所有歌曲
playMusic.post('/getSheetAllMusic', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/playlist/track/all?id=${req.body.sheetId}`);
})
// 获取专辑内容
playMusic.post('/getAlbum',(req,res)=>{
    res.redirect(`${connectMusic.musicURL}/album?id=${req.body.albumId}`);
})

module.exports = playMusic;