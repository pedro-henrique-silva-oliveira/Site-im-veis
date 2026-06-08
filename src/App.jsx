import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';

const PropertyPage = lazy(() => import('./pages/PropertyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isMapPage = location.pathname === '/mapa';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased">
      {!isMapPage && <Header />}
      <main className={isMapPage ? '' : 'flex-grow'}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imovel/:id" element={<PropertyPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isMapPage && <Footer />}
    </div>
  );
}