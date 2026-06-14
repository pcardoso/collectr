import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Receipt, ReceiptCategory } from '../types';
import { format } from 'date-fns';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface ReceiptStore {
  receipts: Receipt[];
  selectedMonth: string;
  accountantEmail: string;

  // Actions
  setSelectedMonth: (month: string) => void;
  setAccountantEmail: (email: string) => void;
  addReceipt: (receipt: Omit<Receipt, 'id' | 'uploadedAt'>) => Receipt;
  updateReceipt: (id: string, updates: Partial<Receipt>) => void;
  removeReceipt: (id: string) => void;

  // Selectors
  getReceiptsByMonth: (month: string) => Receipt[];
  getAllMonths: () => string[];
}

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set, get) => ({
      receipts: [],
      selectedMonth: format(new Date(), 'yyyy-MM'),
      accountantEmail: '',

      setSelectedMonth: (month) => set({ selectedMonth: month }),

      setAccountantEmail: (email) => set({ accountantEmail: email }),

      addReceipt: (receipt) => {
        const newReceipt: Receipt = {
          ...receipt,
          id: generateId(),
          uploadedAt: new Date().toISOString(),
        };
        set((state) => ({ receipts: [...state.receipts, newReceipt] }));
        return newReceipt;
      },

      updateReceipt: (id, updates) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === id ? { ...r, ...updates } : r,
          ),
        })),

      removeReceipt: (id) =>
        set((state) => ({
          receipts: state.receipts.filter((r) => r.id !== id),
        })),

      getReceiptsByMonth: (month) =>
        get().receipts.filter((r) => r.month === month),

      getAllMonths: () => {
        const months = new Set(get().receipts.map((r) => r.month));
        // Always include current month
        months.add(format(new Date(), 'yyyy-MM'));
        return Array.from(months).sort().reverse();
      },
    }),
    {
      name: 'collectr-storage',
      // Don't persist dataUrl blobs to avoid hitting localStorage limits
      partialize: (state) => ({
        ...state,
        receipts: state.receipts.map(({ dataUrl: _dataUrl, ...rest }) => rest),
      }),
    },
  ),
);

export type { ReceiptCategory };
