const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Service = require('../models/Service');
const generateInvoicePDF = require('../utils/pdfGenerator');
// Create an invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientId, services, invoiceNumber, issueDate, dueDate, status } = req.body;

    // Find the client
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate totalFee for each service and ensure the services exist
    const servicesWithFees = await Promise.all(
      services.map(async (service) => {
        const serviceData = await Service.findById(service.serviceId);
        if (!serviceData) {
          throw new Error(`Service not found with ID: ${service.serviceId}`);
        }
        const totalFee = serviceData.price * service.quantity;
        return { ...service, totalFee };
      })
    );

    const totalAmount = servicesWithFees.reduce((acc, service) => acc + service.totalFee, 0);

    // Create the invoice
    const invoice = new Invoice({
      invoiceNumber,
      clientId,
      clientName: client.name, // Use client name from the client record
      services: servicesWithFees,
      issueDate,
      dueDate,
      totalAmount,
      status,
    });

    // Save the invoice to the database
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(400).json({ message: 'Error creating invoice', error: error.message });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('clientId') // Populate client details
      .populate('services.serviceId'); // Populate service details
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id)
      .populate('clientId') // Populate client details
      .populate('services.serviceId'); // Populate service details

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// Update invoice by ID
exports.updateInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, status, issueDate, dueDate, invoiceNumber } = req.body;

    // Find the existing invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Calculate new total fee for services
    const updatedServicesWithFees = await Promise.all(
      services.map(async (service) => {
        const serviceData = await Service.findById(service.serviceId);
        if (!serviceData) {
          throw new Error(`Service not found with ID: ${service.serviceId}`);
        }
        const totalFee = serviceData.price * service.quantity;
        return { ...service, totalFee };
      })
    );

    const totalAmount = updatedServicesWithFees.reduce((acc, service) => acc + service.totalFee, 0);

    // Update the invoice
    invoice.services = updatedServicesWithFees;
    invoice.totalAmount = totalAmount;
    invoice.status = status || invoice.status;
    invoice.issueDate = issueDate || invoice.issueDate;
    invoice.dueDate = dueDate || invoice.dueDate;
    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber;

    // Save the updated invoice
    const updatedInvoice = await invoice.save();
    res.status(200).json({ message: 'Invoice updated successfully', updatedInvoice });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
};

// Delete invoice by ID
exports.deleteInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Error deleting invoice', error: error.message });
  }
};



//pdf generation

exports.generateInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch invoice data
    const invoice = await Invoice.findById(id)
      .populate('clientId')
      .populate('services.serviceId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Transform invoice data for PDF utility
    const invoiceData = {
      id: invoice.invoiceNumber,
      clientName: invoice.clientId.name,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      services: invoice.services.map((service) => ({
        servicename: service.serviceId.servicename,
        fee: service.serviceId.fee,
        quantity: service.quantity,
        totalFee: service.totalFee,
      })),
      total: invoice.totalAmount,
    };

    // Set headers for the PDF response
    const sanitizedInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Disposition', `inline; filename=Invoice_${sanitizedInvoiceNumber}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Generate PDF using the utility
    generateInvoicePDF(invoiceData, res);
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};
