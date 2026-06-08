import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-200 transition-transform duration-200 group-hover:scale-105">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight leading-none m-0 p-0">
              Pedro H. <span className="text-indigo-600">Corretor</span>
            </h1>
            <span className="text-xs text-slate-400 font-medium tracking-wide block mt-1">CRECI: 123456-F</span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              isHome
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Imóveis
          </button>
          <button
            onClick={() => navigate('/mapa')}
            className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${
              location.pathname === '/mapa'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Mapa
          </button>


        </nav>
      </div>
    </header>
  );
}
