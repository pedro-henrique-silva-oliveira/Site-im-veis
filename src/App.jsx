import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertyPage from './pages/PropertyPage';
import AdminPage from './pages/AdminPage';
import MapPage from './pages/MapPage';

export default function App() {
  const location = useLocation();
  const isMapPage = location.pathname === '/mapa';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased">
      {!isMapPage && <Header />}
      <main className={isMapPage ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/imovel/:id" element={<PropertyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isMapPage && <Footer />}
    </div>
  );
}
