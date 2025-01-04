import { useState } from 'react';
import { useLabels } from '../context/LabelsContext';
import { useItems } from '../context/ItemsContext';
import LabelForm from '../components/LabelForm';
import { Label } from '../types';
import { printLabel } from '../utils/printUtils';

function Labels() {
  const { labels, loading, createLabel, deleteLabel } = useLabels();
  const { items } = useItems();
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);

  const handleCreateLabel = async (data: Omit<Label, 'id' | 'createdAt'>) => {
    try {
      await createLabel(data);
      setIsCreatingLabel(false);
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  };

  const handleDeleteLabel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      try {
        await deleteLabel(id);
      } catch (error) {
        console.error('Failed to delete label:', error);
      }
    }
  };

  const handlePrintLabel = (label: Label) => {
    const item = items.find(i => i.id === label.itemId);
    if (item) {
      printLabel(label, item);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Labels</h1>
        <button
          onClick={() => setIsCreatingLabel(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Label
        </button>
      </div>

      {isCreatingLabel && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Create New Label</h2>
            <LabelForm
              onSubmit={handleCreateLabel}
              onCancel={() => setIsCreatingLabel(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labels.map((label) => {
          const item = items.find((i) => i.id === label.itemId);
          return (
            <div
              key={label.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{item?.name}</h3>
                  <p className="text-sm text-gray-500">
                    Format: {label.format}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {label.quantity}
                  </p>
                  {label.customText && (
                    <p className="text-sm text-gray-500">
                      Custom Text: {label.customText}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteLabel(label.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => handlePrintLabel(label)}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Print Label
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Labels; 