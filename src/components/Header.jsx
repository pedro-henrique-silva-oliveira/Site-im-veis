import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Lock, LogOut, Briefcase, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, handleLogout } = useApp();
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

          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin')}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Meu Painel
              </button>
              <button
                onClick={() => { handleLogout(); navigate('/'); }}
                title="Sair do Painel"
                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
            >
              <Lock className="w-4 h-4" />
              Área Restrita
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
