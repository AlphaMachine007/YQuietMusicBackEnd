const { Schema, default: mongoose } = require("mongoose");

const statusSchema = new Schema({
    id:{
        type:Number,
    },
    status:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        default:5
    }
})

module.exports = statusSchema