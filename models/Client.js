const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  address: { type: String, required: true }
});

module.exports = mongoose.model('Client', clientSchema);
