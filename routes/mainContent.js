const express = require('express');
// 创建 express 应用
const mainContent = express();
// 引入重定向配置
const connectMusic = require('../config/connectMusic')

// 获取主页轮播图图像
mainContent.get("/getBanner",(req,res)=>{
    res.redirect(`${connectMusic.musicURL}/banner`)
})
// 获取主页歌单推荐
mainContent.get("/getPlayListComm",(req,res)=>{
    res.redirect(`${connectMusic.musicURL}/personalized?limit=10`)
})
// 获得所有榜单内容摘要
mainContent.get('/getAllTopList', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/toplist/detail`);
})

module.exports = mainContent