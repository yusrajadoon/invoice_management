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

// Routes with error checking
const routes = {
  '/clients': './routes/clients',
  '/services': './routes/services',
  '/invoices': './routes/invoices',
  '/payments': './routes/payments',
  '/branches': './routes/branches'
};

Object.entries(routes).forEach(([path, routeFile]) => {
  try {
    const router = require(routeFile);
    if (typeof router === 'function') {
      app.use(path, router);
    } else {
      console.error(`Warning: Router at ${routeFile} is not a function`);
    }
  } catch (error) {
    console.error(`Error loading route ${routeFile}:`, error);
  }
});

// Debugging log to confirm server is running
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
