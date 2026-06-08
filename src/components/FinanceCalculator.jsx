import { useState } from 'react';
import { Calculator, Search, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const CAIXA_SIMULATOR_URL = 'https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso';

function maskCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export default function FinanceCalculator({ price }) {
  const [entryPercent, setEntryPercent] = useState(30);
  const [interestRate, setInterestRate] = useState(9.5);
  const [termYears, setTermYears] = useState(30);

  const [cpf, setCpf] = useState('');
  const [usarRenda, setUsarRenda] = useState(false);
  const [rendaDeclarada, setRendaDeclarada] = useState('');
  const [creditStatus, setCreditStatus] = useState('idle');
  const [creditResult, setCreditResult] = useState(null);

  const entryAmount = price * (entryPercent / 100);
  const financeAmount = price - entryAmount;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = termYears * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0 && totalPayments > 0 && financeAmount > 0) {
    monthlyPayment = financeAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  const totalPaid = monthlyPayment * totalPayments;
  const totalInterest = totalPaid - financeAmount;

  const format = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const handleCheckCredit = async () => {
    const rawCpf = cpf.replace(/\D/g, '');
    if (rawCpf.length !== 11) { alert('Digite um CPF válido com 11 dígitos.'); return; }

    setCreditStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/simular/credito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: rawCpf,
          valor_financiamento: financeAmount,
          ...(usarRenda && rendaDeclarada ? { renda_mensal: parseFloat(rendaDeclarada.replace(/\D/g, '')) } : {}),
          taxa_juros: interestRate,
          prazo_meses: totalPayments,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Erro ao consultar crédito' }));
        throw new Error(err.detail);
      }
      const data = await res.json();
      setCreditResult(data);
      setCreditStatus(data.aprovado ? 'approved' : 'rejected');
    } catch (err) {
      alert(`Erro: ${err.message}`);
      setCreditStatus('idle');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Simular Financiamento</h5>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Valor do Imóvel</label>
          <p className="text-lg font-black text-slate-900">{format(price)}</p>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Seu CPF</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="000.000.000-00"
              value={maskCPF(cpf)}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-mono"
            />
            <button
              onClick={handleCheckCredit}
              disabled={creditStatus === 'loading' || cpf.length < 11}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-lg transition-all flex items-center gap-1.5"
            >
              {creditStatus === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {creditStatus === 'loading' ? 'Consultando...' : 'Consultar'}
            </button>
          </div>

          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={usarRenda}
              onChange={(e) => setUsarRenda(e.target.checked)}
              className="accent-indigo-600 w-4 h-4"
            />
            <span className="text-xs text-slate-500 font-medium">Informar minha renda mensal</span>
          </label>
          {usarRenda && (
            <input
              type="text"
              placeholder="Renda mensal bruta (R$)"
              value={rendaDeclarada}
              onChange={(e) => setRendaDeclarada(e.target.value.replace(/\D/g, ''))}
              className="w-full mt-2 px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
            />
          )}
        </div>

        {creditStatus !== 'idle' && creditResult && (
          <div className={`rounded-xl p-4 border ${creditStatus === 'approved' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-3">
              {creditStatus === 'approved' ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm leading-relaxed">
                <p className={`font-bold mb-1 ${creditStatus === 'approved' ? 'text-emerald-800' : 'text-red-800'}`}>
                  {creditStatus === 'approved' ? 'Crédito Aprovado' : 'Crédito não aprovado'}
                </p>
                <p className={`${creditStatus === 'approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                  {creditResult.mensagem}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Entrada: {entryPercent}% ({format(entryAmount)})</label>
          <input
            type="range"
            min={10}
            max={80}
            value={entryPercent}
            onChange={(e) => setEntryPercent(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>10%</span><span>80%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Taxa de Juros Anual: {interestRate}%</label>
          <input
            type="range"
            min={5}
            max={15}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5%</span><span>15%</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Prazo: {termYears} anos</label>
          <input
            type="range"
            min={5}
            max={35}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5 anos</span><span>35 anos</span>
          </div>
        </div>
      </div>

      {financeAmount > 0 && (
        <div className="bg-indigo-50 rounded-xl p-4 space-y-2 border border-indigo-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Valor Financiado</span>
            <strong className="text-slate-900">{format(financeAmount)}</strong>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Parcela Mensal</span>
            <strong className="text-xl font-black text-indigo-700">{format(monthlyPayment)}</strong>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Total de Juros</span>
            <strong className="text-slate-900">{format(totalInterest)}</strong>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-indigo-200 pt-2 mt-1">
            <span className="text-slate-600 font-medium">Total a Pagar</span>
            <strong className="text-slate-900">{format(totalPaid)}</strong>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <a
          href={CAIXA_SIMULATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Simular na Caixa Econômica Federal
        </a>
      </div>
    </div>
  );
}
