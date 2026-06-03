import { useState } from 'react';
import { Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

const defaultForm = { name: '', phone: '', email: '', message: '' };

export default function ContactForm({ property }) {
  const { addLead } = useApp();
  const [form, setForm] = useState(defaultForm);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    addLead({
      id: crypto.randomUUID(),
      propertyId: property.id,
      propertyTitle: property.title,
      ...form,
      createdAt: new Date().toISOString(),
    });

    const whatsappMessage = encodeURIComponent(
      `Olá! Meu nome é ${form.name}. Vi o imóvel "${property.title}" e gostaria de mais informações.\n\nTelefone: ${form.phone}\nE-mail: ${form.email || 'não informado'}\n\nMensagem: ${form.message || 'Gostaria de saber mais detalhes.'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${whatsappMessage}`, '_blank');

    setSent(true);
    setForm(defaultForm);
  };

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6" />
        </div>
        <h5 className="text-base font-extrabold text-slate-900 mb-1">Mensagem enviada!</h5>
        <p className="text-sm text-slate-500">Seu contato foi registrado. Em breve retornarei.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Enviar Mensagem</h5>

      <div className="relative">
        <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Seu nome *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
          required
        />
      </div>

      <div className="relative">
        <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="tel"
          placeholder="Seu telefone *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
          required
        />
      </div>

      <div className="relative">
        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
        />
      </div>

      <div className="relative">
        <MessageSquare className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <textarea
          placeholder="Sua mensagem"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={3}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
      >
        Enviar e Abrir WhatsApp
      </button>
      <p className="text-[10px] text-slate-400 text-center">Seus dados serão enviados diretamente para o corretor.</p>
    </form>
  );
}
