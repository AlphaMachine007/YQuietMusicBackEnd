const mongoose = require('../config/connectDB');
const chatSchema = require('../db/Schema/chatSchema');

const chat = mongoose.model('chat',chatSchema);

module.exports = chat;