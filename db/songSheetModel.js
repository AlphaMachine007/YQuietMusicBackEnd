const mongoose = require('../config/connectDB');
const songSheetSchema = require('../db/Schema/songSheetSchema');

const songSheet = mongoose.model("songSheet",songSheetSchema);

module.exports = songSheet;