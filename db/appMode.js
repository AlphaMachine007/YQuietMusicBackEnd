const mongoose = require('../config/connectDB')
// 定义Schema.js文件
const schema = require('./Schema/userSchema');

// 定义模型,表名为userInfo
const appModel = mongoose.model("userInfo",schema);


module.exports = appModel;
    