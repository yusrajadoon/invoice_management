const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  payerName: { type: String, required: true },   // Added payerName field
  referenceId: { type: String, required: true }, // Added referenceId field
  description: { type: String, default: '' }     // Added description field (optional)
});

module.exports = mongoose.model('Payment', paymentSchema);
