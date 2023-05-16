const mongoose = require('../config/connectDB')
const playListSchema = require('../db/Schema/playListSchema')

const playListModel = mongoose.model("playList",playListSchema);

module.exports = playListModel;