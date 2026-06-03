import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function FinanceCalculator({ price }) {
  const [entryPercent, setEntryPercent] = useState(30);
  const [interestRate, setInterestRate] = useState(9.5);
  const [termYears, setTermYears] = useState(30);

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
    </div>
  );
}
