import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Building, PlusCircle, Eye, Edit, Trash, Phone, Calendar, Mail, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice, generatePropertyUrl } from '../utils/formatters';
import CRUDForm from './CRUDForm';

export default function AdminDashboard() {
  const { properties, setProperties, leads, visits } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const totalImoveis = properties.length;
  const totalVendas = properties.filter(p => p.dealType === 'venda').length;
  const totalLocacao = properties.filter(p => p.dealType === 'aluguel').length;

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel permanentemente?")) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleOpenCreate = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const tabs = [
    { id: 'properties', label: 'Imóveis', icon: Home },
    { id: 'leads', label: 'Leads', icon: User },
    { id: 'visits', label: 'Visitas', icon: Calendar },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>Modo Administrativo</span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight m-0 mt-1">Painel do Corretor</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={handleOpenCreate}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Cadastrar Novo Imóvel
          </button>
          <button onClick={() => navigate('/')}
            className="px-4 py-3 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all">
            Ver Site Público
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Total de Imóveis</span>
            <strong className="text-3xl font-black text-slate-900 block mt-1">{totalImoveis}</strong>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <Home className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Imóveis para Venda</span>
            <strong className="text-3xl font-black text-slate-900 block mt-1">{totalVendas}</strong>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">Imóveis para Locação</span>
            <strong className="text-3xl font-black text-slate-900 block mt-1">{totalLocacao}</strong>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-8">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30'
                      : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'properties' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Imóvel / Ref</th>
                  <th className="py-4 px-6">Local / Bairro</th>
                  <th className="py-4 px-6">Tipo / Finalidade</th>
                  <th className="py-4 px-6">Preço</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                          <img src={prop.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-900 line-clamp-1">{prop.title}</span>
                          <span className="text-[11px] text-indigo-500 font-bold uppercase mt-0.5 block">Cód: {prop.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-slate-800 font-medium">{prop.neighborhood}</div>
                      <div className="text-xs text-slate-400">{prop.city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                          prop.dealType === 'venda' ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' : 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                        }`}>
                          {prop.dealType === 'venda' ? 'Venda' : 'Aluguel'}
                        </span>
                        <span className="text-slate-500 text-xs font-semibold capitalize">{prop.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-950">{formatPrice(prop.price, prop.dealType)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(generatePropertyUrl(prop.id))} title="Visualizar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button onClick={() => handleOpenEdit(prop)} title="Editar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          <Edit className="w-4.5 h-4.5" />
                        </button>
                        <button onClick={() => handleDelete(prop.id)} title="Excluir"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p>Nenhum imóvel cadastrado no portfólio.</p>
                <button onClick={handleOpenCreate} className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">
                  Cadastrar Primeiro Imóvel
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="p-6">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Nenhum lead recebido ainda.</p>
                <p className="text-xs mt-1">Os contatos dos visitantes aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-slate-900">{lead.name}</strong>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                          {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Imóvel: <strong>{lead.propertyTitle}</strong></p>
                    {lead.message && <p className="text-xs text-slate-500 mt-1 bg-white p-2 rounded border border-slate-100">"{lead.message}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="p-6">
            {visits.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">Nenhuma visita agendada.</p>
                <p className="text-xs mt-1">Os agendamentos dos visitantes aparecerão aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {visits.map((visit) => (
                  <div key={visit.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <strong className="text-slate-900">{visit.name}</strong>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {visit.phone}</span>
                          {visit.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {visit.email}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(visit.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Imóvel: <strong>{visit.propertyTitle}</strong></p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                        <Calendar className="w-3 h-3" /> {new Date(visit.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg">
                        {visit.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isFormOpen && <CRUDForm editingProperty={editingProperty} onClose={() => setIsFormOpen(false)} />}
    </div>
  );
}
