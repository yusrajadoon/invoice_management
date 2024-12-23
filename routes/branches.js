const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// Routes
router.post('/', branchController.createBranch);       // Create a branch
router.get('/', branchController.getAllBranches);      // Get all branches
router.get('/:id', branchController.getBranchById);    // Get branch by ID
router.put('/:id', branchController.updateBranch);     // Update branch by ID
router.delete('/:id', branchController.deleteBranch);  // Delete branch by ID

module.exports = router;
