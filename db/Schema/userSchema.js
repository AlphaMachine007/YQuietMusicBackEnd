const { Schema, default: mongoose } = require("mongoose");
// 加密工具
const bcrypt = require('bcrypt')
// 加密时间(越长越安全，但不推荐太长)
let SALT_WORK_FACTOR = 10

// 定义login的Schema
const userSchema = new Schema({
    account: {
        type: String,
        require:true,
    },
    password: {
        type: String,
        require:true,
    },
    name:{
        type:String,
    },
    sex:{
        type:Number,
        default:1
    },
    avatar:{
        type:Buffer,
        default:null
    },
    focusNum:{
        type:Number,
        default:0
    },
    fansNum:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        default:'其他'
    },
    description:{
        type:String,
        default:'沉迷听歌，无法自拔'
    },
    myFavorite:{
        type:Array,
        default:[]
    }

});
userSchema.pre('validate',function(next){
    const user = this;
    //产生密码hash当密码有更改的时候(或者是新密码)
    if(!user.isModified('password')) return next()

    // 产生一个salt
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
        if(err) return next(err)

        //  结合salt产生新的hash
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // 使用hash覆盖明文密码
            user.password = hash;
            next();
        });
    })
})

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = userSchema
// const LoginModel = mongoose.model('LoginModel', LoginSchema)

// module.exports = LoginModel

