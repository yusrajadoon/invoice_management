const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Create a new client
router.post("/", clientController.createClient);

// Get all clients
router.get("/", clientController.getAllClients);

// Get client by ID
router.get("/:id", clientController.getClientById);

// Update client by ID
router.put("/:id", clientController.updateClientById);

// Delete client by ID
router.delete("/:id", clientController.deleteClientById);

module.exports = router;
