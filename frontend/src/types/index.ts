export type FileType = 'pdf' | 'email' | 'image' | 'other';

export type RecurringCategory = 'hosting' | 'services' | 'comms' | 'rent';

export type ReceiptCategory = RecurringCategory | 'custom';

export const RECURRING_CATEGORIES: RecurringCategory[] = [
  'hosting',
  'services',
  'comms',
  'rent',
];

export const CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  hosting: 'Hosting',
  services: 'Services',
  comms: 'Communications',
  rent: 'Rent',
  custom: 'Other',
};

export const CATEGORY_COLORS: Record<ReceiptCategory, string> = {
  hosting: 'bg-purple-100 text-purple-800 border-purple-200',
  services: 'bg-blue-100 text-blue-800 border-blue-200',
  comms: 'bg-green-100 text-green-800 border-green-200',
  rent: 'bg-orange-100 text-orange-800 border-orange-200',
  custom: 'bg-gray-100 text-gray-800 border-gray-200',
};

export interface Receipt {
  id: string;
  name: string;
  fileName: string;
  fileType: FileType;
  fileUrl?: string;
  dataUrl?: string;
  category: ReceiptCategory;
  month: string; // YYYY-MM
  uploadedAt: string; // ISO string
  amount?: number;
  vendor?: string;
  notes?: string;
}

export interface UploadResponse {
  url: string;
  key: string;
}
