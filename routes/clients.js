const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Create a new client
router.post("/", clientController.createClient);

// Get all clients
router.get("/clients", clientController.getAllClients);

// Get client by ID
router.get("/clients/:id", clientController.getClientById);

// Update client by ID
router.put("/clients/:id", clientController.updateClientById);

// Delete client by ID
router.delete("/clients/:id", clientController.deleteClientById);

module.exports = router;
