import { Header } from './components/Header';
import { Routes } from './pages/Routes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Routes />
      </main>
    </div>
  );
}

export default App;
