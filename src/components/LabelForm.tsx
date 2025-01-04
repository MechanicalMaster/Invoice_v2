import { useState } from 'react';
import { useItems } from '../context/ItemsContext';
import { Label, Item } from '../types';

interface LabelFormProps {
  onSubmit: (data: Omit<Label, 'id' | 'createdAt'>) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

function LabelForm({ onSubmit, onCancel, loading }: LabelFormProps) {
  const { items } = useItems();
  const [itemId, setItemId] = useState('');
  const [format, setFormat] = useState<'small' | 'medium' | 'large'>('medium');
  const [quantity, setQuantity] = useState('1');
  const [customText, setCustomText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      itemId,
      format,
      quantity: parseInt(quantity),
      customText: customText.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="item" className="block text-sm font-medium text-gray-700">
          Item
        </label>
        <select
          id="item"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        >
          <option value="">Select an item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="format" className="block text-sm font-medium text-gray-700">
          Label Format
        </label>
        <select
          id="format"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={format}
          onChange={(e) => setFormat(e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          required
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="customText" className="block text-sm font-medium text-gray-700">
          Custom Text (optional)
        </label>
        <textarea
          id="customText"
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Label'}
        </button>
      </div>
    </form>
  );
}

export default LabelForm; 