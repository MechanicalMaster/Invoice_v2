import { useState, useEffect } from 'react';
import { useItems } from '../context/ItemsContext';
import { Invoice, InvoiceItem, Item } from '../types';

interface InvoiceFormProps {
  onSubmit: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Invoice;
}

function InvoiceForm({ onSubmit, onCancel, initialData }: InvoiceFormProps) {
  const { items } = useItems();
  const [formData, setFormData] = useState({
    invoiceNumber: (Math.floor(Math.random() * 9000) + 1000).toString(), // Generate random 4-digit number
    date: new Date(),
    gstNumber: 'SUJ234567891Z',
    companyName: 'KIRPA JEWELLERS',
    companyAddress: 'Your Company Address,Kolhapur,Maharashtra,India',
    companyPhone: '9876543210',
    companyEmail: 'company123@gmail.com',
    stateCode: '27',
    
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    customerStateCode: '',
    
    paymentMode: 'CASH' as const,
    
    items: [] as InvoiceItem[],
    
    cgst: 0,
    sgst: 0,
    totalGst: 0,
    subTotal: 0,
    additionalDiscount: 0,
    totalAmount: 0,
  });

  const [selectedItem, setSelectedItem] = useState({
    itemId: '',
    quantity: 1,
    hsn: '',
    grossWeight: 0,
    netWeight: 0,
    purity: '',
    labour: 0
  });

  const calculateTotals = (items: InvoiceItem[]) => {
    const subTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);
    const gst = subTotal * 0.03; // 3% GST (1.5% CGST + 1.5% SGST)
    const cgst = gst / 2;
    const sgst = gst / 2;
    const totalAmount = subTotal + gst - formData.additionalDiscount;

    return {
      subTotal,
      cgst,
      sgst,
      totalGst: gst,
      totalAmount
    };
  };

  const handleAddItem = () => {
    const item = items.find(i => i.id === selectedItem.itemId);
    if (!item) return;

    const newInvoiceItem: InvoiceItem = {
      itemId: item.id,
      name: item.name,
      hsn: selectedItem.hsn,
      grossWeight: selectedItem.grossWeight,
      netWeight: selectedItem.netWeight,
      purity: selectedItem.purity,
      rate: item.price,
      labour: selectedItem.labour,
      quantity: selectedItem.quantity,
      totalAmount: (item.price * selectedItem.quantity) + (selectedItem.labour || 0)
    };

    const updatedItems = [...formData.items, newInvoiceItem];
    const totals = calculateTotals(updatedItems);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      ...totals
    }));

    // Reset selected item
    setSelectedItem({
      itemId: '',
      quantity: 1,
      hsn: '',
      grossWeight: 0,
      netWeight: 0,
      purity: '',
      labour: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Please add at least one item to the invoice');
      return;
    }
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Please try again.');
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-4 md:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-4">
          <h2 className="text-xl md:text-2xl font-serif text-gray-900">Create New Invoice</h2>
          <p className="mt-1 text-sm text-gray-500">Invoice #{formData.invoiceNumber}</p>
        </div>

        {/* Customer Details Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900 font-serif mb-4">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={formData.customerName}
                onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={formData.customerPhone}
                onChange={e => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                required
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={formData.customerAddress}
                onChange={e => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State Code
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={formData.customerStateCode}
                onChange={e => setFormData(prev => ({ ...prev, customerStateCode: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Add Items Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-base md:text-lg font-medium text-gray-900 font-serif mb-4">
            Item Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Item
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedItem.itemId}
                onChange={e => setSelectedItem(prev => ({ ...prev, itemId: e.target.value }))}
              >
                <option value="">Select an item...</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                HSN
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.hsn}
                onChange={e => setSelectedItem(prev => ({ ...prev, hsn: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gross Weight (gm)
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.grossWeight}
                onChange={e => setSelectedItem(prev => ({ ...prev, grossWeight: parseFloat(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Net Weight (gm)
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.netWeight}
                onChange={e => setSelectedItem(prev => ({ ...prev, netWeight: parseFloat(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purity
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.purity}
                onChange={e => setSelectedItem(prev => ({ ...prev, purity: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Labour Charge
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.labour}
                onChange={e => setSelectedItem(prev => ({ ...prev, labour: parseFloat(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={selectedItem.quantity}
                onChange={e => setSelectedItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  HSN
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wt.(g)
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purity
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labour
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.hsn}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.grossWeight}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.netWeight}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.purity}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.rate}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.labour}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                    ₹{item.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">₹{formData.subTotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">CGST (1.5%)</dt>
              <dd className="text-sm font-medium text-gray-900">₹{formData.cgst.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">SGST (1.5%)</dt>
              <dd className="text-sm font-medium text-gray-900">₹{formData.sgst.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm font-medium text-gray-600">Additional Discount</dt>
              <dd className="text-sm font-medium text-gray-900">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  value={formData.additionalDiscount}
                  onChange={e => {
                    const discount = parseFloat(e.target.value) || 0;
                    const totals = calculateTotals(formData.items);
                    setFormData(prev => ({
                      ...prev,
                      additionalDiscount: discount,
                      totalAmount: totals.totalAmount - discount
                    }));
                  }}
                />
              </dd>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <dt className="text-lg font-medium text-gray-900">Total Amount</dt>
              <dd className="text-lg font-bold text-indigo-600">₹{formData.totalAmount.toFixed(2)}</dd>
            </div>
          </dl>
        </div>

        {/* Action Buttons - Make sticky to bottom */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceForm; 