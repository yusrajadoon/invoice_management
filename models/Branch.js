const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNo: { type: String, required: true }
});

module.exports = mongoose.model('Branch', branchSchema);
