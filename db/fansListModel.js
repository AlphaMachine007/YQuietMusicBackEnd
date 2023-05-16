const mongoose = require('../config/connectDB');
const fansListSchema = require('../db/Schema/fansListSchema');

const fansListModel = mongoose.model('fansList',fansListSchema);

module.exports = fansListModel;