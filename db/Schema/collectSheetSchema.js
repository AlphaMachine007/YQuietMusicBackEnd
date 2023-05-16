const { Schema } = require("mongoose");

const collectSheetSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    collectSheetInfo:{
        type:Array,
        default:[]
    }
    // sheetId:{
    //     type:String,
    //     required:true
    // },
    // sheetName: {
    //     type: String,
    //     required: true
    // },
    // sheetContent: {
    //     type: Array,
    //     default:[]
    // },
    // sheetDescribe: {
    //     type: String,
    //     default: '这里一尘不染，快来留下你的痕迹吧~'
    // },
    // sheetCreator: {
    //     type: String
    // },
    // sheetCreatedTime: {
    //     type: String,
    //     default: () => new Date().toLocaleString()
    // },
    // playNum:{
    //     type:Number,
    //     default:0
    // },
    // isCollect:{
    //     type:Boolean,
    //     default:true
    // }
})

module.exports = collectSheetSchema