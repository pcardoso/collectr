import { useState } from 'react';
import {
  RECURRING_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  RecurringCategory,
  Receipt,
} from '../types';
import { DropZone } from './DropZone';
import { ReceiptCard } from './ReceiptCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface RecurringSlotsProps {
  month: string;
  receipts: Receipt[];
  onFileDrop: (files: File[], category: RecurringCategory) => void;
  onDelete: (id: string) => void;
}

export function RecurringSlots({ month, receipts, onFileDrop, onDelete }: RecurringSlotsProps) {
  const [collapsed, setCollapsed] = useState<Record<RecurringCategory, boolean>>({
    hosting: false,
    services: false,
    comms: false,
    rent: false,
  });

  const toggle = (cat: RecurringCategory) =>
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Recurring
      </h3>
      {RECURRING_CATEGORIES.map((cat: RecurringCategory) => {
        const catReceipts = receipts.filter((r) => r.category === cat);
        const isCollapsed = collapsed[cat];
        return (
          <div
            key={cat}
            className="rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Category header */}
            <button
              onClick={() => toggle(cat)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[cat]}`}
              >
                {CATEGORY_LABELS[cat]}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {catReceipts.length} file{catReceipts.length !== 1 ? 's' : ''}
              </span>
            </button>

            {/* Category body */}
            {!isCollapsed && (
              <div className="p-3 space-y-2">
                {catReceipts.map((r) => (
                  <ReceiptCard key={r.id} receipt={r} onDelete={onDelete} />
                ))}
                <DropZone
                  month={month}
                  category={cat}
                  onFileDrop={(files) => onFileDrop(files, cat)}
                  compact
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
