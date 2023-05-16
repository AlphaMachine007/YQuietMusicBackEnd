const express = require('express');

const music = express();
const playListInfo = require('../db/playListModel');
const userInfo = require('../db/appMode');
const songSheet = require('../db/songSheetModel');
const collectSheet = require('../db/collectSheetModel');
const tokenTool = require('../utils/createToken');
const connectMusic = require('../config/connectMusic');
const authorize = require('../utils/authorizesTool');

// 播放列表中添加歌曲
music.post('/addToPlayList', (req, res) => {
    playListInfo.findByIdAndUpdate(req.body.userId, { $addToSet: { playListsInfo: req.body.playLists } }, { upsert: true, new: true, setDefaultsOnInsert: true })
        .then((docs) => {
            res.send({
                state: 200,
                msg: '添加成功'
            })
        }).catch((err) => {
            res.send({
                state: 403,
                data: {
                    err
                }
            })
        })

});
// 删除播放列表歌曲
music.delete('/removeMusicById/:musicId', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            playListInfo.findById(result.data._id)
                .then(docs => {
                    const array = docs.playListsInfo;
                    const index = array.findIndex(item => item.id == req.params.musicId);
                    if (index != -1) {
                        array.splice(index, 1);
                    }
                    playListInfo.updateOne({ _id: result.data._id }, { $set: { "playListsInfo": array } })
                        .then(music => {
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
});
// 获取播放列表
music.get('/getPlayList', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            playListInfo.find({ _id: result.data._id }, { _id: 0 })
                .then((docs) => {
                    res.send({
                        state: 200,
                        msg: '获取完成',
                        data: docs[0]
                    })
                }).catch((err) => {
                    res.send({
                        state: 404,
                        data: err
                    })
                })
        }
    })
});

// 播放全部(替换播放列表)
music.post('/playAllMusic', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            req.body.forEach(elem => {
                delete elem.isShowOpe;
            })
            playListInfo.updateOne({ _id: result.data._id }, { $set: { "playListsInfo": req.body } })
                .then(docs => {
                    res.send({
                        state: 200
                    })
                }).catch(err => {
                    res.send({
                        state: 402,
                        err
                    })
                })
        }
    })
});
// 创建歌单
music.post('/createSongSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            songSheet.create({ userId: result.data._id, sheetName: req.body.sheetName, sheetCreator: result.data.name })
                .then(docs => {
                    res.send({
                        state: 200,
                        msg: '创建成功'
                    })
                }).catch(err => {
                    res.send({
                        state: 402,
                        msg: '创建失败',
                        err
                    })
                })
        }
    })

});
// 获取歌单
music.get('/getSongSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            songSheet.find({ userId: result.data._id }, { userId: 0 })
                .then(sheet => {
                    res.send({
                        state: 200,
                        msg: '获取成功',
                        data: sheet
                    })
                }).catch(err => {
                    res.send({
                        state: 403,
                        msg: '获取失败',
                        err
                    })
                })
        }
    })
});
// 通过用户id获取歌单
music.post('/getSongSheetById', (req, res) => {
    songSheet.find({ userId: req.body.userId }, { userId: 0 })
        .then(sheet => {
            res.send({
                state: 200,
                msg: '获取成功',
                data: sheet
            })
        }).catch(err => {
            res.send({
                state: 403,
                msg: '获取失败',
                err
            })
        })
})
// 向歌单中添加歌曲
music.post('/addSongToSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            const { songSheetId, ...musicInfo } = req.body;
            songSheet.findByIdAndUpdate(req.body.songSheetId, { $addToSet: { sheetContent: musicInfo } })
                .then(docs => {
                    res.send({
                        state: 200,
                        msg: '添加成功'
                    })
                }).catch(err => {
                    res.send({
                        state: 402,
                        msg: '添加歌曲',
                        err
                    })
                })
        }
    })
});
// 删除歌单中的歌曲
music.post('/removeSongFromSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            songSheet.findById(req.body.sheetId)
                .then(docs => {
                    const array = docs.sheetContent;
                    const index = array.findIndex(elem => elem.id == req.body.musicId);
                    if (index != -1) {
                        array.splice(index, 1);
                    }
                    songSheet.updateOne({ _id: req.body.sheetId }, { $set: { "sheetContent": array } })
                        .then(music => {
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
});
// 修改歌单
music.post('/editSongSheet', authorize.authorization, (req, res) => {
    if (req.body.sheetName == '') {
        res.send({
            state: 403,
            msg: '歌单名称不能为空!'
        })
    } else {
        songSheet.findByIdAndUpdate(req.body._id, { sheetName: req.body.sheetName, sheetDescribe: req.body.sheetDescribe, playNum: req.body.playNum })
            .then(docs => {
                res.send({
                    state: 200,
                    msg: '修改完成'
                })
            }).catch(err => {
                res.send({
                    state: 401,
                    msg: '修改失败',
                    err
                })
            })
    }
});
// 删除歌单
music.delete('/removeSongSheet/:sheetId', authorize.authorization, (req, res) => {
    const sheetId = req.params.sheetId;
    songSheet.deleteOne({ _id: sheetId })
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
});
// 从我的最爱向其他歌单添加歌曲
music.post('/addToOtherSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            userInfo.findById(result.data._id, { myFavorite: 1 })
                .then(arr => {
                    songSheet.updateMany({ _id: { $in: req.body } }, { $addToSet: { sheetContent: { $each: arr.myFavorite } } })
                        .then(docs => {
                            res.send({
                                state: 200,
                                msg: '添加成功',
                            })
                        }).catch(err => {
                            res.send({
                                state: 402,
                                msg: '添加失败',
                                err
                            })
                        })
                }).catch(err => {
                    console.error(err)
                })
        }
    })
});
// 获取收藏歌单列表
music.get('/getCollectSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            collectSheet.findOne({ userId: result.data._id }, { userId: 0 })
                .then(docs => {
                    res.send({
                        state: 200,
                        data: docs
                    })
                }).catch(err => {
                    res.send({
                        state: 402,
                        msg: '获取失败',
                        err
                    })
                })
        }
    })
});
// 通过Id获取收藏歌单列表
music.post('/getCollectSheetById', (req, res) => {
    collectSheet.findOne({ userId: req.body.userId }, { userId: 0 })
        .then(docs => {
            res.send({
                state: 200,
                data: docs
            })
        }).catch(err => {
            res.send({
                state: 402,
                msg: '获取失败',
                err
            })
        })
})
// 收藏歌单
music.post('/addToCollectSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            collectSheet.updateOne({ userId: result.data._id }, { $addToSet: { collectSheetInfo: req.body } })
                .then(docs => {
                    res.send({
                        state: 200,
                        msg: '添加成功'
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
});
// 取消收藏
music.post('/removeCollectSheet', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            collectSheet.findOne({ userId: result.data._id })
                .then(sheet => {
                    const array = sheet.collectSheetInfo;
                    const index = array.findIndex(elem => elem._id == req.body.sheetId);
                    if (index != -1) {
                        array.splice(index, 1);
                    }
                    collectSheet.updateOne({ userId: result.data._id }, { $set: { 'collectSheetInfo': array } })
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
                        msg: '查找失败',
                        err
                    })
                })
        }
    })
});
// 向播放列表中添加多首歌曲
music.post('/addManyToPlayList', (req, res) => {
    tokenTool.verify_token(req, res, result => {
        if (result.status === 200) {
            const sendMusic = req.body.map(elem => {
                return {
                    id: elem.id,
                    name: elem.name,
                    singer: elem.singer,
                    album: elem.album,
                    time: elem.time
                }
            })
            playListInfo.updateMany({ _id: result.data._id }, { $addToSet: { playListsInfo: { $each: sendMusic } } })
                .then(docs => {
                    res.send({
                        state: 200,
                        msg: '添加成功'
                    })
                }).catch(err => {
                    res.send({
                        state: 401,
                        msg: '添加失败',
                        err
                    })
                })
        }
    })
});
module.exports = music;