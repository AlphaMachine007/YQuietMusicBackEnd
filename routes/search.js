const express = require('express');
// 创建 express 应用
const search = express();
const connectMusic = require('../config/connectMusic')
const userInfo = require('../db/appMode');
// 搜索
search.post('/searchInfo', (req, res) => {
    res.redirect(`${connectMusic.musicURL}/cloudsearch?keywords=${req.body.keywords}&limit=${req.body.limit}&offset=${req.body.offset}&type=${req.body.type}`)
})
// 搜索用户
search.post('/searchUser', async (req, res) => {
    if (req.body.keywords != null) {
        const result = await userInfo.find({ name: { $regex: req.body.keywords, $options: 'i' } },{password:0}).skip((req.body.page - 1) * req.body.limit).limit(req.body.limit);
        const resultTotal = await userInfo.find({name:{ $regex: req.body.keywords, $options: 'i' }});
        const totalCount = resultTotal.length;
        const temp = result.map(elem => {
            if(elem.avatar!=null){
                return {...elem,avatar:'data:image/png;base64,' + Buffer.from(elem.avatar).toString('base64')}
            }else{
                return elem;
            }
        });
        res.send({
            state: 200,
            msg: '查询成功',
            data: {
                users:temp,
                count:totalCount
            }
        })
    }
})


module.exports = search;