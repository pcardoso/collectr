import { useState } from 'react';
import { format, parseISO, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReceiptStore } from '../store/receiptStore';

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth, getAllMonths } = useReceiptStore();
  const [showPicker, setShowPicker] = useState(false);
  const allMonths = getAllMonths();

  const parsed = parseISO(`${selectedMonth}-01`);

  const prev = () => setSelectedMonth(format(subMonths(parsed, 1), 'yyyy-MM'));
  const next = () => setSelectedMonth(format(addMonths(parsed, 1), 'yyyy-MM'));

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prev}
        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        title="Previous month"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="px-4 py-1.5 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-brand-400 hover:text-brand-700 shadow-sm transition-colors min-w-[150px] text-center"
        >
          {format(parsed, 'MMMM yyyy')}
        </button>

        {showPicker && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 bg-white rounded-xl border border-gray-200 shadow-lg p-2 min-w-[180px]">
            {allMonths.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2 px-3">
                No months yet
              </p>
            ) : (
              allMonths.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowPicker(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    m === selectedMonth
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {format(parseISO(`${m}-01`), 'MMMM yyyy')}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <button
        onClick={next}
        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        title="Next month"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
