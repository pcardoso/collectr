import { useState } from 'react';
import { Receipt, ArchiveX, Mail } from 'lucide-react';
import { MonthSelector } from './MonthSelector';
import { EmailComposer } from './EmailComposer';
import { useReceiptStore } from '../store/receiptStore';

export function Header() {
  const { selectedMonth, getReceiptsByMonth } = useReceiptStore();
  const [showEmail, setShowEmail] = useState(false);
  const count = getReceiptsByMonth(selectedMonth).length;

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              Collectr
            </span>
          </div>

          {/* Month selector */}
          <MonthSelector />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {count === 0 ? (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                <ArchiveX className="w-4 h-4" />
                No receipts
              </div>
            ) : (
              <button
                onClick={() => setShowEmail(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:block">Email Accountant</span>
                <span className="sm:hidden">Email</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showEmail && (
        <EmailComposer
          month={selectedMonth}
          onClose={() => setShowEmail(false)}
        />
      )}
    </>
  );
}
