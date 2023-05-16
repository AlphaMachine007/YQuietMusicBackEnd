const mongoose = require('../config/connectDB');
const focusListSchema = require('../db/Schema/focusListSchema');

const focusListModel = mongoose.model('focusList',focusListSchema);

module.exports = focusListModel;