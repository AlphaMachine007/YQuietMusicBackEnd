const { Schema } = require("mongoose");

const focusListSchema = new Schema({
    userId:{
        type:String,
        required: true
    },
    focusList:{
        type:Array,
        default:[]
    }
});

module.exports = focusListSchema;