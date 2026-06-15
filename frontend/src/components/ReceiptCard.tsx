import { Receipt } from '../types';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '../types';
import { FileText, Mail, Image, File, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptCardProps {
  receipt: Receipt;
  onDelete: (id: string) => void;
}

function FileIcon({ fileType }: { fileType: Receipt['fileType'] }) {
  const cls = 'w-5 h-5';
  switch (fileType) {
    case 'pdf':
      return <FileText className={`${cls} text-red-500`} />;
    case 'email':
      return <Mail className={`${cls} text-blue-500`} />;
    case 'image':
      return <Image className={`${cls} text-green-500`} />;
    default:
      return <File className={`${cls} text-gray-400`} />;
  }
}

export function ReceiptCard({ receipt, onDelete }: ReceiptCardProps) {
  const url = receipt.fileUrl || receipt.dataUrl;

  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
      {/* File icon */}
      <div className="flex-shrink-0 mt-0.5">
        <FileIcon fileType={receipt.fileType} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-900 truncate">
            {receipt.name || receipt.fileName}
          </p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[receipt.category]}`}
          >
            {CATEGORY_LABELS[receipt.category]}
          </span>
        </div>

        {receipt.vendor && (
          <p className="text-xs text-gray-500 mt-0.5">{receipt.vendor}</p>
        )}

        {receipt.amount !== undefined && (
          <p className="text-xs font-medium text-gray-700 mt-0.5">
            {receipt.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        )}

        {receipt.notes && (
          <p className="text-xs text-gray-400 mt-1 italic">{receipt.notes}</p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          {format(new Date(receipt.uploadedAt), 'MMM d, yyyy HH:mm')}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open file"
            className="p-1 text-gray-400 hover:text-brand-600 rounded"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={() => onDelete(receipt.id)}
          title="Delete receipt"
          className="p-1 text-gray-400 hover:text-red-600 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
