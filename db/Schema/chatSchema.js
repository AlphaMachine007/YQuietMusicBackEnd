const { Schema } = require("mongoose");

const chatSchema = new Schema({
    userA:{
        type:Object,
        required:true
    },
    userB:{
        type:Object,
        required:true
    },
    messageContent:{
        type:Array,
        default:[]
    }
})

module.exports = chatSchema;