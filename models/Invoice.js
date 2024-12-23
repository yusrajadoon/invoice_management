const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId, // Use ObjectId for clientId
    ref: "Client", // Reference to Client model
    required: true,
  },
  clientName: {
    type: String,
    required: true, // Add clientName from frontend
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for serviceId
        ref: "Service", // Reference to Service model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Quantity must be at least 1
      },
      totalFee: {
        type: Number,
        required: true,
        min: 0, // Total fee must be at least 0
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true, // Total amount as calculated in the frontend
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue','Cancelled'],  // Enum for status (Paid or Pending)
  },
  issueDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
