const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Create an invoice
router.post('/', invoiceController.createInvoice);

// Get all invoices
router.get('/', invoiceController.getAllInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Update invoice by ID
router.put('/:id', invoiceController.updateInvoiceById);

// Delete invoice by ID
router.delete('/:id', invoiceController.deleteInvoiceById);

// Generate Invoice PDF
router.get('/generate-pdf/:id', invoiceController.generateInvoicePDF);

module.exports = router;
