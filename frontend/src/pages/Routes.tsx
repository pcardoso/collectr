import { useRoute } from 'wouter';
import { MonthView } from '../components/MonthView';
import { useReceiptStore } from '../store/receiptStore';

function HomePage() {
  const { selectedMonth } = useReceiptStore();
  return <MonthView month={selectedMonth} />;
}

function NotFound() {
  return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-lg font-medium">Page not found</p>
    </div>
  );
}

export function Routes() {
  const [isHome] = useRoute('/');
  if (isHome) return <HomePage />;
  return <NotFound />;
}
