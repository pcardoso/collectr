import { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { useReceiptStore } from '../store/receiptStore';
import { ReceiptCard } from './ReceiptCard';
import { DropZone } from './DropZone';
import { RecurringSlots } from './RecurringSlots';
import { AddReceiptModal } from './AddReceiptModal';
import { Receipt, ReceiptCategory, RecurringCategory } from '../types';
import { detectFileType, uploadFile, readFileAsDataUrl } from '../hooks/useUpload';
import { Plus } from 'lucide-react';

interface MonthViewProps {
  month: string; // YYYY-MM
}

export function MonthView({ month }: MonthViewProps) {
  const { getReceiptsByMonth, addReceipt, removeReceipt } = useReceiptStore();
  const receipts = getReceiptsByMonth(month);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; category?: ReceiptCategory } | null>(null);
  const [uploading, setUploading] = useState(false);

  const customReceipts = receipts.filter((r) => r.category === 'custom');
  const parsed = parseISO(`${month}-01`);
  const monthLabel = format(parsed, 'MMMM yyyy');

  const processFiles = useCallback(
    async (files: File[], category: ReceiptCategory = 'custom') => {
      for (const file of files) {
        // Open modal for the first file; subsequent files auto-add with defaults
        if (files.indexOf(file) === 0) {
          setPendingFiles({ file, category });
          setIsModalOpen(true);
        } else {
          // Auto-add remaining files
          setUploading(true);
          try {
            let fileUrl: string | undefined;
            let dataUrl: string | undefined;

            try {
              const res = await uploadFile(file);
              fileUrl = res.url;
            } catch {
              // Backend not available – fall back to data URL
              dataUrl = await readFileAsDataUrl(file);
            }

            addReceipt({
              name: file.name,
              fileName: file.name,
              fileType: detectFileType(file),
              fileUrl,
              dataUrl,
              category,
              month,
            });
          } finally {
            setUploading(false);
          }
        }
      }
    },
    [addReceipt, month],
  );

  const handleModalSubmit = useCallback(
    async (data: {
      name: string;
      vendor?: string;
      amount?: number;
      notes?: string;
      category: ReceiptCategory;
    }) => {
      if (!pendingFiles) return;
      const { file } = pendingFiles;

      setUploading(true);
      setIsModalOpen(false);
      try {
        let fileUrl: string | undefined;
        let dataUrl: string | undefined;

        try {
          const res = await uploadFile(file);
          fileUrl = res.url;
        } catch {
          dataUrl = await readFileAsDataUrl(file);
        }

        addReceipt({
          name: data.name || file.name,
          fileName: file.name,
          fileType: detectFileType(file),
          fileUrl,
          dataUrl,
          category: data.category,
          month,
          vendor: data.vendor,
          amount: data.amount,
          notes: data.notes,
        });
      } finally {
        setUploading(false);
        setPendingFiles(null);
      }
    },
    [addReceipt, month, pendingFiles],
  );

  const handleRecurringDrop = useCallback(
    (files: File[], cat: RecurringCategory) => {
      processFiles(files, cat);
    },
    [processFiles],
  );

  return (
    <div className="space-y-6">
      {/* Month heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{monthLabel}</h2>
        <span className="text-sm text-gray-400">
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring slots column */}
        <div className="space-y-4">
          <RecurringSlots
            month={month}
            receipts={receipts}
            onFileDrop={handleRecurringDrop}
            onDelete={removeReceipt}
          />
        </div>

        {/* Custom receipts column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Other Receipts
            </h3>
            <button
              onClick={() => {
                setPendingFiles(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add manually
            </button>
          </div>

          {customReceipts.map((r: Receipt) => (
            <ReceiptCard key={r.id} receipt={r} onDelete={removeReceipt} />
          ))}

          <DropZone
            month={month}
            category="custom"
            onFileDrop={(files) => processFiles(files, 'custom')}
          />

          {uploading && (
            <p className="text-xs text-gray-400 text-center animate-pulse">
              Uploading…
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddReceiptModal
          file={pendingFiles?.file ?? null}
          defaultCategory={pendingFiles?.category ?? 'custom'}
          month={month}
          onSubmit={handleModalSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setPendingFiles(null);
          }}
          onAddWithoutFile={(data) => {
            addReceipt({ ...data, month, fileName: '', fileType: 'other' });
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
