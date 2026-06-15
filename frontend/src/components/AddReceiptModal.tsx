import { useState } from 'react';
import { X } from 'lucide-react';
import { ReceiptCategory, CATEGORY_LABELS, RECURRING_CATEGORIES } from '../types';

interface AddReceiptModalProps {
  file: File | null;
  defaultCategory: ReceiptCategory;
  month: string;
  onSubmit: (data: {
    name: string;
    vendor?: string;
    amount?: number;
    notes?: string;
    category: ReceiptCategory;
  }) => void;
  onCancel: () => void;
  onAddWithoutFile: (data: {
    name: string;
    vendor?: string;
    amount?: number;
    notes?: string;
    category: ReceiptCategory;
    fileType: 'other';
  }) => void;
}

export function AddReceiptModal({
  file,
  defaultCategory,
  onSubmit,
  onCancel,
  onAddWithoutFile,
}: AddReceiptModalProps) {
  const [name, setName] = useState(file?.name ?? '');
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<ReceiptCategory>(defaultCategory);

  const allCategories: ReceiptCategory[] = [...RECURRING_CATEGORIES, 'custom'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: name.trim() || (file?.name ?? 'Untitled'),
      vendor: vendor.trim() || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      notes: notes.trim() || undefined,
      category,
    };

    if (file) {
      onSubmit(data);
    } else {
      onAddWithoutFile({ ...data, fileType: 'other' });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {file ? 'Add Receipt' : 'Add Receipt Manually'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {file && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-gray-400 text-xs flex-shrink-0">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name / Description
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={file?.name ?? 'e.g. AWS Invoice June 2024'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReceiptCategory)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor (optional)
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. AWS, GitHub, Google"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional info…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
            >
              Save Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
