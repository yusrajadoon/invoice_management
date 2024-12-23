const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoiceData, stream) => {
  try {
    const doc = new PDFDocument({ margin: 50 });

    // Pipe the PDF into the writable stream
    doc.pipe(stream);

    // Header Section
    doc
      .fontSize(20)
      .text(`Invoice #${invoiceData.id}`, { align: 'center' })
      .moveDown();

    doc.fontSize(14).text(`Client Name: ${invoiceData.clientName}`);
    doc.text(`Issue Date: ${invoiceData.issueDate}`);
    doc.text(`Due Date: ${invoiceData.dueDate}`);
    doc.text(`Status: ${invoiceData.status}`).moveDown();

    // Table Header for Services
    const startX = doc.x;
    const startY = doc.y;
    const tableHeaders = ['Service Name', 'Fee', 'Quantity', 'Total'];
    tableHeaders.forEach((header, index) => {
      doc.text(header, startX + index * 100, startY, {
        width: 100,
        align: 'center',
        underline: true,
      });
    });

    // Draw a line under the headers
    doc.moveDown();
    doc.moveTo(startX, startY + 15).lineTo(startX + 400, startY + 15).stroke();

    // Service Rows
    invoiceData.services.forEach((service, index) => {
      const rowY = startY + 20 + index * 20;
      doc.text(service.servicename, startX, rowY, { width: 100, align: 'left' });
      doc.text(`$${service.fee}`, startX + 100, rowY, { width: 100, align: 'center' });
      doc.text(service.quantity.toString(), startX + 200, rowY, { width: 100, align: 'center' });
      doc.text(`$${service.totalFee}`, startX + 300, rowY, { width: 100, align: 'right' });
    });

    // Invoice Total
    doc.moveDown().moveDown();
    doc.text(`Total Amount: $${invoiceData.total}`, { align: 'right' });

    // Footer - Payment Details
    doc
      .moveDown()
      .fontSize(12)
      .text('Payment Details:', { underline: true });

    doc.text('AC Holder: BASES THERAPY CLINIC PVT LTD');
    doc.text('Bank Name: BANK ALFALAH');
    doc.text('Account No: 0148-1006845095');
    doc.text('IBAN: PK79ALFH0148001006845095').moveDown();

    // Terms and Conditions
    doc.text('Terms and Conditions:', { underline: true });
    doc.text(
      'Kindly be aware that all fees paid for our products/services are non-refundable. This policy applies to all transactions.'
    );
    doc.text(
      'Penalty: A 1000/- penalty applies from the 7th day, escalating daily until the outstanding amount is settled.'
    );

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

module.exports = generateInvoicePDF;
