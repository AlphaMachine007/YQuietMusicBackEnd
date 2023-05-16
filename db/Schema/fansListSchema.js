const { Schema } = require("mongoose");

const fansListSchema = new Schema({
    userId:{
        type:String,
        required: true
    },
    fansList:{
        type:Array,
        default:[]
    }
});

module.exports = fansListSchema;