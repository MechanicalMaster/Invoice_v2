import { useState } from 'react';
import { useInvoices } from '../context/InvoicesContext';
import InvoiceForm from '../components/InvoiceForm';
import { printInvoice } from '../utils/printUtils';

function Invoices() {
  const { invoices, loading, createInvoice } = useInvoices();
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  const handleCreateInvoice = async (data: Omit<Invoice, 'id'>) => {
    try {
      await createInvoice(data);
      setIsCreatingInvoice(false);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <button
          onClick={() => setIsCreatingInvoice(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Invoice
        </button>
      </div>

      {isCreatingInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="max-w-6xl w-full h-[90vh] relative">
            <InvoiceForm
              onSubmit={handleCreateInvoice}
              onCancel={() => setIsCreatingInvoice(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">Invoice #{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500">
                  {invoice.date.toLocaleDateString()}
                </p>
                <p className="text-sm font-medium mt-2">
                  Customer: {invoice.customerName}
                </p>
                <p className="text-sm text-gray-500">
                  Amount: ₹{invoice.totalAmount.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => printInvoice(invoice)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Invoices; 