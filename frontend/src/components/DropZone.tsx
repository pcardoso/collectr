import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { ReceiptCategory } from '../types';

interface DropZoneProps {
  month: string;
  category?: ReceiptCategory;
  onFileDrop: (files: File[], category?: ReceiptCategory) => void;
  compact?: boolean;
}

export function DropZone({ month: _month, category, onFileDrop, compact = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileDrop(files, category);
      }
    },
    [category, onFileDrop],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) {
        onFileDrop(files, category);
      }
      // Reset so the same file can be re-added
      e.target.value = '';
    },
    [category, onFileDrop],
  );

  if (compact) {
    return (
      <label
        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm
          ${isDragging
            ? 'border-brand-500 bg-brand-50 text-brand-700'
            : 'border-gray-300 text-gray-400 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-4 h-4" />
        <span>Drop or click</span>
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.eml,.msg,.jpg,.jpeg,.png,.gif,.webp"
          onChange={handleInputChange}
        />
      </label>
    );
  }

  return (
    <label
      className={`flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-xl border-2 border-dashed cursor-pointer transition-colors
        ${isDragging
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-gray-300 text-gray-400 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-brand-500' : 'text-gray-300'}`} />
      <div className="text-center">
        <p className="text-sm font-medium">
          {isDragging ? 'Drop files here' : 'Drag & drop receipts here'}
        </p>
        <p className="text-xs mt-1 text-gray-400">
          PDF, EML, images — click to browse
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.eml,.msg,.jpg,.jpeg,.png,.gif,.webp"
        onChange={handleInputChange}
      />
    </label>
  );
}
