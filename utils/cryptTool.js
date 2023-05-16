const bcrypt = require('bcrypt')
// 加密时间
const saltRounds = 10

function decrypt(val){
    if(!val || val.length < 24)return val;
    return bcrypt.decrypt(val)
}

function encrypt(val){
    // 兼容旧数据
    if(!val || val.length > 24)return val;
    return bcrypt.encrypt(val)
}

module.exports = {
    encrypt,
    decrypt
}