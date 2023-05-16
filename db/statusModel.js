const mongoose = require('../config/connectDB')
const statusSchema = require('./Schema/statuSchema')

const statusModel = mongoose.model("status",statusSchema);

module.exports = statusModel