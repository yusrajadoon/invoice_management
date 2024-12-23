const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Route to create a new service
router.post('/', serviceController.createService);

// Route to fetch all services
router.get('/', serviceController.getAllServices);

// Route to fetch a single service by ID
router.get('/:id', serviceController.getServiceById);

// Route to update a service by ID
router.put('/:id', serviceController.updateService);

// Route to delete a service by ID
router.delete('/:id', serviceController.deleteService);

module.exports = router;
