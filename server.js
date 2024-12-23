require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const connectDB = require('./config/database');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Enable CORS for all routes

// Connect to MongoDB
connectDB();

// Routes
app.use('/clients', require('./routes/clients'));
app.use('/services', require('./routes/services'));
app.use('/invoices', require('./routes/invoices'));
app.use('/payments', require('./routes/payments'));
app.use('/branches', require('./routes/branches')); // Add branch routes

// Debugging log to confirm server is running
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
