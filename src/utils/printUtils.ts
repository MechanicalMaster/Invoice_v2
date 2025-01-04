import { Label, Item, Invoice } from '../types';

export const printLabel = (label: Label, item: Item) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Label - ${item.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .label {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 10px;
            page-break-inside: avoid;
            ${label.format === 'small' ? 'width: 2in; height: 1in;' : 
              label.format === 'medium' ? 'width: 3in; height: 2in;' : 
              'width: 4in; height: 3in;'}
          }
          .item-name {
            font-weight: bold;
            font-size: ${label.format === 'small' ? '10pt' : 
                        label.format === 'medium' ? '12pt' : '14pt'};
          }
          .custom-text {
            margin-top: 5px;
            font-size: ${label.format === 'small' ? '8pt' : 
                        label.format === 'medium' ? '10pt' : '12pt'};
          }
        </style>
      </head>
      <body>
        ${Array(label.quantity).fill(0).map(() => `
          <div class="label">
            <div class="item-name">${item.name}</div>
            ${label.customText ? `<div class="custom-text">${label.customText}</div>` : ''}
          </div>
        `).join('')}
        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const printInvoice = (invoice: Invoice) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${invoice.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .customer-details, .invoice-info {
            width: 48%;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
          .totals {
            float: right;
            width: 300px;
          }
          .amount-in-words {
            margin-top: 20px;
            font-style: italic;
          }
          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-name">${invoice.companyName}</div>
          <div>${invoice.companyAddress}</div>
          <div>Phone: ${invoice.companyPhone} | Email: ${invoice.companyEmail}</div>
          <div>GSTIN: ${invoice.gstNumber} | State Code: ${invoice.stateCode}</div>
        </div>

        <div class="invoice-details">
          <div class="customer-details">
            <strong>Customer Details:</strong><br>
            ${invoice.customerName}<br>
            ${invoice.customerAddress}<br>
            Phone: ${invoice.customerPhone}<br>
            State Code: ${invoice.customerStateCode}
          </div>
          <div class="invoice-info">
            <strong>Invoice Details:</strong><br>
            Invoice No: ${invoice.invoiceNumber}<br>
            Date: ${invoice.date.toLocaleDateString()}<br>
            Payment Mode: ${invoice.paymentMode}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr.No.</th>
              <th>Item Name & Description</th>
              <th>Qty.</th>
              <th>HSN</th>
              <th>Gross Wt.</th>
              <th>Net Wt.</th>
              <th>Purity</th>
              <th>Rate</th>
              <th>Labour</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.hsn || ''}</td>
                <td>${item.grossWeight || ''}</td>
                <td>${item.netWeight || ''}</td>
                <td>${item.purity || ''}</td>
                <td>${item.rate.toFixed(2)}</td>
                <td>${item.labour || ''}</td>
                <td>${item.totalAmount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Sub Total:</td>
              <td>${invoice.subTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>CGST @ 1.5%:</td>
              <td>${invoice.cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td>SGST @ 1.5%:</td>
              <td>${invoice.sgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Additional Discount:</td>
              <td>${invoice.additionalDiscount.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Total Amount:</strong></td>
              <td><strong>${invoice.totalAmount.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>

        <div class="amount-in-words">
          Amount in Words: ${numberToWords(invoice.totalAmount)} Only
        </div>

        <div class="footer">
          <div>Customer Signature</div>
          <div>For ${invoice.companyName}</div>
        </div>

        <script>
          window.onload = () => {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

function numberToWords(num: number): string {
  // Implement number to words conversion
  // You can use a library like 'number-to-words' or implement your own
  return num.toString();
} 