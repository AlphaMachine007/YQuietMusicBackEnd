const mongoose = require('../config/connectDB');
const collectSheetSchema = require('../db/Schema/collectSheetSchema');

const collectSheet = mongoose.model("collectSheet",collectSheetSchema);

module.exports = collectSheet;