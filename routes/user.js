const express = require('express');
// 创建 express 应用
const user = express();
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();
const multiparty = require('multiparty');
const userInfo = require('../db/appMode');
const statusInfo = require('../db/statusModel');
const playListInfo = require('../db/playListModel');
const collectSheet = require('../db/collectSheetModel');
const focusList = require('../db/focusListModel');
const fansList = require('../db/fansListModel');
const tokenTool = require('../utils/createToken');
const jwt = require('jsonwebtoken');
const authorize = require('../utils/authorizesTool');

// 登录
user.post('/login', function (req, res) {
    if (req.body.account && req.body.password && req.body.account != '' && req.body.password != '') {
        userInfo.findOne({ account: req.body.account })
            .then((docs) => {
                if (docs === null) {
                    res.send({
                        state: 204,
                        data: {
                            msg: '用户名或密码不匹配'
                        }
                    })
                }
                // 验证密码
                docs.comparePassword(req.body.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        let { password, __v, avatar, myFavorite, ...sendUser } = docs._doc
                        let token = tokenTool.createToken(sendUser)
                        res.send({
                            state: 200,
                            data: {
                                msg: '验证成功',
                                sendUser,
                                token
                            }
                        })
                    } else {
                        res.send({
                            state: 204,
                            data: {
                                msg: '用户名或密码不匹配'
                            }
                        })
                    }
                })
            }).catch((err) => {
                console.log(err)
            })
    } else {
        res.send({
            state: 201,
            data: {
                msg: '账号或密码为空'
            }
        })
    }
})
// 注册
user.post('/regist', function (req, res) {
    if (req.body.account && req.body.password && req.body.account != '' && req.body.password != '') {
        userInfo.find({ account: req.body.account }, { account: 1, _id: 0 })
            .then((err, docs) => {
                if (err.length > 0) {
                    res.send({
                        state: 202,
                        data: {
                            msg: '该账号已被注册',
                            info: docs
                        }
                    })
                } else {
                    userInfo.insertMany({
                        account: req.body.account,
                        password: req.body.password,
                        name: req.body.account
                    }).then((result) => {
                        let id = result[0]._id.toString();
                        playListInfo.create({ _id: id }).then(docs => {
                            console.log(docs);
                        }).catch(err => {
                            console.log(err);
                        });
                        collectSheet.create({ userId: id }).then(docs => {
                            console.log(docs);
                        }).catch(err => {
                            console.log(err);
                        });
                        focusList.create({ userId: id }).then(docs => {
                            console.log(docs);
                        }).catch(err => {
                            console.log(err);
                        });
                        fansList.create({ userId: id }).then(docs => {
                            console.log(docs);
                        }).catch(err => {
                            console.log(err);
                        })
                        res.send({
                            state: 200,
                            data: {
                                msg: '注册成功',
                                info: req.body
                            }
                        })
                    }).catch((err) => {
                        res.send({
                            state: 203,
                            data: {
                                msg: '注册失败',
                                info: err
                            }
                        })
                    });
                }
            }).catch((err) => {
                res.send({
                    state:403,
                    msg:'查找数据异常'
                })
            })
    } else {
        res.send({
            state: 201,
            data: {
                msg: '账号或密码为空'
            }
        })
    }
})
// 获取用户信息(token校验)
user.get('/passport/auth/getUserInfo', function (req, res) {
    const headers = req.headers;
    const token = headers['authorization'].split(' ')[1];
    // 认证token
    const result = jwt.verify(token, tokenTool.secret, (err, paylod) => {
        if (err) res.send({
            state: 403,
            message: `${err.name}: ${err.message} at ${err.expiredAt}`,
        })
        console.log(paylod);
        if (paylod) {
            const { exp, iat, ...sendUser } = paylod
            res.send({
                state: 200,
                message: '认证成功',
                data: { sendUser }
            })
        }
    })

})
// 获取身份列表
user.get('/userinfo/getStatusList', function (req, res) {
    statusInfo.find({}, { status: 1, value: 1 })
        .then((docs) => {
            res.send({
                state: 200,
                msg: '查询成功',
                data: docs
            })
        }).catch((err) => {
            console.log(err)
            res.send({
                state: 401,
                msg: '查询失败'
            })
        })
})
// 修改用户信息
user.post('/userinfo/updateUserInfo', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            const { _id, ...changeInfo } = req.body;
            userInfo.findOne({ _id: req.body._id }, { account: 1 })
                .then((docs) => {
                    if (docs.account === req.body.account) {
                        userInfo.updateOne({ _id: req.body._id }, changeInfo)
                            .then((docs) => {
                                let token = tokenTool.createToken(req.body)
                                res.send({
                                    state: 200,
                                    message: '修改成功',
                                    data: {
                                        userInfo: req.body,
                                        token
                                    }
                                })
                            }).catch((err) => {
                                console.log(err)
                            })
                    } else {
                        userInfo.findOne({ account: req.body.account })
                            .then((docs) => {
                                if (docs == null) {
                                    userInfo.updateOne({ _id: req.body._id }, changeInfo)
                                        .then((docs) => {
                                            let token = tokenTool.createToken(req.body)
                                            res.send({
                                                state: 200,
                                                message: '修改成功',
                                                data: {
                                                    userInfo: req.body,
                                                    token
                                                }
                                            })
                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                } else {
                                    res.send({
                                        state: 201,
                                        msg: '手机号已存在'
                                    })
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    })

})
// 修改用户头像
user.post('/userinfo/updateAvatar', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            let form = new multiparty.Form();
            // 设置文件存储路径(从根目录开始)
            form.uploadDir = "./avatar";
            // 设置单文件大小限制
            form.maxFilesSize = 2 * 1024 * 1024;

            form.parse(req);

            form.on('part', async part => {
                if (part.filename) {
                    // 文件将被保存到 form.uploadDir 指定的目录中
                    // let writeStream = fs.createWriteStream(path.join(form.uploadDir,part.filename))
                    // part.pipe(writeStream)
                    let buffers = [];
                    part.on('data', chunk => {
                        buffers.push(chunk);
                    });
                    part.on('end', async () => {
                        let buffer = Buffer.concat(buffers)
                        // 由于verify方法为异步方法，采用回调函数来获取结果
                        tokenTool.verify_token(req, res, result => {
                            if (result.status === 200) {
                                userInfo.findOneAndUpdate({ _id: result.data._id }, { avatar: buffer })
                                    .then(docs => {
                                        userInfo.findById(result.data._id)
                                            .then(user => {
                                                let avatar = user.avatar;
                                                let avatarType = 'image/jpeg';
                                                let dataURL = `data:${avatarType};base64,${avatar.toString('base64')}`;
                                                const { password, ...sendUser } = user;
                                                res.send({
                                                    state: 200,
                                                    msg: '修改头像成功',
                                                    data: {
                                                        dataURL,
                                                    }
                                                })
                                            }).catch(err => {
                                                res.send({
                                                    state: 402,
                                                    msg: '查找用户信息失败',
                                                    err
                                                })
                                            })

                                    }).catch(err => {
                                        res.send({
                                            state: 403,
                                            msg: '修改头像失败',
                                            err
                                        });
                                    })
                            }
                        })
                    })
                }
            });
        }
    })
})
// 获取用户头像
user.get('/userinfo/getAvatar', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            userInfo.findById(result.data._id, { avatar: 1, _id: 0 })
                .then(user => {
                    let avatar = user.avatar;
                    let avatarType = 'image/jpeg';
                    let dataURL = `data:${avatarType};base64,${avatar.toString('base64')}`;
                    res.send({
                        state: 200,
                        data: {
                            dataURL
                        }
                    })
                }).catch(err => {
                    res.send({
                        state: 401,
                        msg: '获取失败',
                        err
                    })
                })
        }
    })
})
// 获取我的最爱(歌单)
user.get('/userinfo/getMyFavorite', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            userInfo.findById(result.data._id, { myFavorite: 1, _id: 0 })
                .then((user) => {
                    res.send({
                        state: 200,
                        data: {
                            myFavorite: user.myFavorite
                        }
                    })
                }).catch((err) => {
                    res.send({
                        state: 403,
                        msg: '获取失败',
                        err
                    })
                })
        }
    })
})
// 添加歌曲至我的最爱(歌单)
user.post('/userinfo/addMyFavorite', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            // $addToSet:检查数组中是否已经存在该值，如果存在，则不插入
            userInfo.findByIdAndUpdate(result.data._id, { $addToSet: { myFavorite: req.body } })
                .then((music) => {
                    if (music != null) {
                        res.send({
                            state: 200,
                            msg: '添加成功'
                        })
                    }
                }).catch((err) => {
                    res.send({
                        state: 402,
                        msg: '添加失败',
                        err
                    })
                });
        }
    })
})
// 从我的最爱中删除歌曲
user.delete('/userinfo/deleteMyFavorite/:musicId', function (req, res) {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            userInfo.findById(result.data._id)
                .then(docs => {
                    const array = docs.myFavorite;
                    const index = array.findIndex(elem => elem.id == req.params.musicId);
                    if (index != -1) {
                        array.splice(index, 1);
                    };
                    userInfo.updateOne({ _id: result.data._id }, { $set: { "myFavorite": array } })
                        .then(docs => {
                            res.send({
                                state: 200,
                                msg: '删除成功'
                            })
                        }).catch(err => {
                            res.send({
                                state: 402,
                                msg: '删除失败',
                                err
                            })
                        })
                }).catch(err => {
                    res.send({
                        state: 403,
                        msg: '删除失败',
                        err
                    })
                })
        }
    })
})
// 获取关注列表
user.get('/userinfo/getFocusList', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            focusList.findOne({ userId: result.data._id })
                .then(docs => {
                    res.send({
                        state: 200,
                        data: docs
                    })
                }).catch(err => {
                    res.send({
                        state: 401,
                        msg: '查询失败',
                        err
                    })
                })
        }
    })
})
// 关注用户
user.post('/userinfo/focusUser', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            focusList.findOneAndUpdate({ userId: result.data._id }, { $addToSet: { focusList: req.body.userInfo } })
                .then(docs => {
                    fansList.findOneAndUpdate({ userId: req.body.userInfo._doc ? req.body.userInfo._doc._id : req.body.userInfo._id }, { $addToSet: { fansList: req.body.focusUserInfo } })
                        .then(docs => {
                            if (docs != null) {
                                res.send({
                                    state: 200,
                                    msg: '添加成功'
                                })
                            }
                        }).catch(err => {
                            res.send({
                                state: 405,
                                msg: '添加失败',
                                err
                            })
                        })
                }).catch(err => {
                    res.send({
                        state: 402,
                        msg: '添加失败',
                        err
                    })
                })
        }
    })
})
// 取消关注
user.post('/userinfo/unFocusUser', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            console.log(req.body.userInfo._doc ? req.body.userInfo._doc._id : req.body.userInfo._id)
            fansList.findOne({ userId: req.body.userInfo._doc ? req.body.userInfo._doc._id : req.body.userInfo._id })
                .then(docs => {
                    if (docs != null) {
                        const arr = docs.fansList;
                        const index = arr.findIndex(elem => elem._id == req.body.unFocusUserInfo._id);
                        if (index != -1) {
                            arr.splice(index, 1);
                        }
                        fansList.updateOne({ userId: req.body.userInfo._doc ? req.body.userInfo._doc._id : req.body.userInfo._id }, { $set: { "fansList": arr } })
                            .then(docs => {
                                focusList.findOne({ userId: req.body.unFocusUserInfo._id })
                                    .then(docs => {
                                        if (docs != null) {
                                            const arr = docs.focusList;
                                            const index = arr.findIndex(elem => elem._id == (req.body.userInfo._doc ? req.body.userInfo._doc._id : req.body.userInfo._id));
                                            if (index != -1) {
                                                arr.splice(index, 1);
                                            }
                                            focusList.updateOne({ userId: req.body.unFocusUserInfo._id }, { $set: { "focusList": arr } })
                                                .then(docs => {
                                                    res.send({
                                                        state: 200,
                                                        msg: '取关成功'
                                                    })
                                                }).catch(err => {
                                                    res.send({
                                                        state: 402,
                                                        msg: '取关失败',
                                                        err
                                                    })
                                                })
                                        }
                                    })
                            }).catch(err => {
                                res.send({
                                    state: 401,
                                    msg: '取关失败',
                                    err
                                })
                            })
                    }
                }).catch(err => {
                    res.send({
                        state: 403,
                        msg: '取关失败',
                        err
                    })
                })
        }
    })
})
// 获取粉丝列表
user.get('/userinfo/getFansList', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            fansList.findOne({ userId: result.data._id })
                .then(docs => {
                    res.send({
                        state: 200,
                        data: docs
                    })
                }).catch(err => {
                    res.send({
                        state: 401,
                        msg: '查询失败',
                        err
                    })
                })
        }
    })
})

module.exports = user