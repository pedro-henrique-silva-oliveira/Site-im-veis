import { useNavigate } from 'react-router-dom';
import { Home, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow">
              <Home className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white tracking-tight m-0">Pedro H. Corretor</h4>
          </div>

          <span className="text-xs text-indigo-400 font-semibold block">CRECI: 123456-F</span>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-widest">Navegação</h4>
          <div className="flex flex-col gap-2.5 text-xs">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors text-left font-medium">Página Inicial</button>
            <button onClick={() => navigate('/?dealType=venda')} className="hover:text-white transition-colors text-left font-medium">Imóveis para Comprar</button>
            <button onClick={() => navigate('/?dealType=aluguel')} className="hover:text-white transition-colors text-left font-medium">Imóveis para Alugar</button>

          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-widest">Contato Direto</h4>
          <div className="space-y-3 text-xs leading-relaxed font-medium">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-indigo-400" /> (11) 99999-9999
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-indigo-400" /> São Paulo - SP, Brasil
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium">
        <p>© {new Date().getFullYear()} Pedro H. Corretor de Imóveis. Todos os direitos reservados.</p>

      </div>
    </footer>
  );
}
