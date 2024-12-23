const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  servicename: { type: String, required: true },
  fee: { type: Number, required: true },
  description: { type: String, required: false }, // New field
});

module.exports = mongoose.model('Service', serviceSchema);
