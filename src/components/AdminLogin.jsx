import { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const adminPasscode = import.meta.env.VITE_ADMIN_PASSCODE || '1234';

export default function AdminLogin() {
  const { setIsAdminAuthenticated } = useApp();
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcodeInput === adminPasscode) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('broker_admin_auth', 'true'); } catch { /* ignore */ }
      setPasscodeError('');
      setPasscodeInput('');
    } else {
      setPasscodeError('Código de acesso incorreto.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-xl mt-12">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Lock className="w-7 h-7" />
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 text-center mb-2 tracking-tight leading-none">
        Acesso Restrito ao Corretor
      </h3>
      <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
        Digite seu código de acesso para gerenciar, editar ou cadastrar imóveis em seu portfólio.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Código de Acesso</label>
          <input
            type="password"
            placeholder="Digite seu código de acesso"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 tracking-widest"
            required
          />
        </div>

        {passcodeError && (
          <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg text-center border border-red-100">
            {passcodeError}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Unlock className="w-4 h-4" /> Entrar no Painel
        </button>
      </form>
    </div>
  );
}
