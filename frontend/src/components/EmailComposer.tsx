import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Mail, X, Copy, CheckCheck } from 'lucide-react';
import { useReceiptStore } from '../store/receiptStore';
import { CATEGORY_LABELS, ReceiptCategory } from '../types';

interface EmailComposerProps {
  month: string;
  onClose: () => void;
}

export function EmailComposer({ month, onClose }: EmailComposerProps) {
  const { getReceiptsByMonth, accountantEmail, setAccountantEmail } = useReceiptStore();
  const receipts = getReceiptsByMonth(month);
  const [copied, setCopied] = useState(false);
  const [to, setTo] = useState(accountantEmail);

  const parsed = parseISO(`${month}-01`);
  const monthLabel = format(parsed, 'MMMM yyyy');

  const totalAmount = receipts.reduce((sum, r) => sum + (r.amount ?? 0), 0);

  const receiptLines = receipts
    .map((r, i) => {
      const parts = [
        `${i + 1}. ${r.name || r.fileName}`,
        `   Category: ${CATEGORY_LABELS[r.category as ReceiptCategory]}`,
      ];
      if (r.vendor) parts.push(`   Vendor: ${r.vendor}`);
      if (r.amount !== undefined)
        parts.push(`   Amount: $${r.amount.toFixed(2)}`);
      if (r.fileUrl) parts.push(`   File: ${r.fileUrl}`);
      if (r.notes) parts.push(`   Note: ${r.notes}`);
      return parts.join('\n');
    })
    .join('\n\n');

  const subject = `Receipts & Invoices – ${monthLabel}`;

  const body = `Hi,

Please find below the list of receipts and invoices for ${monthLabel}.

------------------------------------------------------------
RECEIPTS (${receipts.length} item${receipts.length !== 1 ? 's' : ''})
------------------------------------------------------------

${receiptLines || '(no receipts added yet)'}

------------------------------------------------------------
${totalAmount > 0 ? `TOTAL: $${totalAmount.toFixed(2)}` : ''}

Please let me know if you need any additional information.

Best regards`;

  const mailtoHref = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function copyToClipboard() {
    await navigator.clipboard.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function saveEmail() {
    setAccountantEmail(to);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Email to Accountant
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* To field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accountant's Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="accountant@example.com"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={saveEmail}
                className="px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                title="Save as default"
              >
                Save
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              readOnly
              value={subject}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body
            </label>
            <pre className="w-full border border-gray-200 rounded-lg px-3 py-3 text-xs bg-gray-50 text-gray-700 whitespace-pre-wrap font-mono overflow-auto max-h-64">
              {body}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            href={mailtoHref}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            <Mail className="w-4 h-4" />
            Open in Mail App
          </a>
        </div>
      </div>
    </div>
  );
}
