import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { randomId } from '../utils/localStorage';

export default function ScheduleVisit({ property }) {
  const { addVisit } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '' });
  const [sent, setSent] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return;

    addVisit({
      id: randomId(),
      propertyId: property.id,
      propertyTitle: property.title,
      ...form,
      createdAt: new Date().toISOString(),
    });

    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h5 className="text-base font-extrabold text-slate-900 mb-1">Visita Agendada!</h5>
        <p className="text-sm text-slate-500">
          Sua visita para <strong>{property.title}</strong> foi agendada para <strong>{form.date}</strong> às <strong>{form.time}</strong>. Entrarei em contato para confirmar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Agendar Visita</h5>
      <p className="text-xs text-slate-500">Escolha a melhor data e horário para conhecer o imóvel pessoalmente.</p>

      <input
        type="text"
        placeholder="Seu nome *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
        required
      />
      <input
        type="tel"
        placeholder="Seu telefone *"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
        required
      />
      <input
        type="email"
        placeholder="Seu e-mail"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="date"
            value={form.date}
            min={today}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
            required
          />
        </div>
        <div className="relative">
          <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
      >
        Confirmar Agendamento
      </button>
    </form>
  );
}
