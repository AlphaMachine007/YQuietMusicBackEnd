const { Schema } = require("mongoose");

const playListSchema = new Schema({
    playListsInfo:{
        type:Array,
        default:[]
    }
})

module.exports = playListSchema