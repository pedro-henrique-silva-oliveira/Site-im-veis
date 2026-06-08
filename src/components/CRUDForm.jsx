import { useState, useEffect, useCallback } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { predefinedFeatures, geocodeCEP } from '../utils/formatters';
import { randomId } from '../utils/localStorage';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getInitialForm(editingProperty) {
  if (!editingProperty) {
    return {
      title: '', description: '', type: 'apartamento', dealType: 'venda',
      price: '', neighborhood: '', city: '',       cep: '', area: '', bedrooms: '',
      suites: '', bathrooms: '', garages: '', images: [], features: [],
      lat: '', lng: '',
    };
  }
  return {
    title: editingProperty.title,
    description: editingProperty.description,
    type: editingProperty.type,
    dealType: editingProperty.dealType,
    price: editingProperty.price.toString(),
    neighborhood: editingProperty.neighborhood,
    city: editingProperty.city,
      cep: editingProperty.cep || '',
    area: editingProperty.area.toString(),
    bedrooms: editingProperty.bedrooms.toString(),
    suites: editingProperty.suites.toString(),
    bathrooms: editingProperty.bathrooms.toString(),
    garages: editingProperty.garages.toString(),
    images: editingProperty.images || [],
    features: editingProperty.features || [],
    lat: editingProperty.lat?.toString() || '',
    lng: editingProperty.lng?.toString() || '',
  };
}

export default function CRUDForm({ editingProperty, onClose }) {
  const { properties, setProperties, adminToken } = useApp();
  const [form, setForm] = useState(() => getInitialForm(editingProperty));
  const [customFeature, setCustomFeature] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!editingProperty;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleImageUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddManualImageUrl = (e) => {
    e.preventDefault();
    if (manualImageUrl.trim()) {
      setForm(prev => ({ ...prev, images: [...prev.images, manualImageUrl.trim()] }));
      setManualImageUrl('');
    }
  };

  const handleRemoveImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleToggleFeature = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleAddCustomFeature = (e) => {
    e.preventDefault();
    if (customFeature.trim() && !form.features.includes(customFeature.trim())) {
      setForm(prev => ({ ...prev, features: [...prev.features, customFeature.trim()] }));
      setCustomFeature('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.neighborhood || !form.city || !form.area) {
      alert("Por favor, preencha os campos obrigatórios (Título, Preço, Bairro, Cidade, Área).");
      return;
    }

    const id = editingProperty ? editingProperty.id : randomId();

    const payload = {
      id,
      titulo: form.title,
      descricao: form.description || "",
      tipo: form.type,
      transacao: form.dealType,
      preco: parseFloat(form.price),
      bairro: form.neighborhood,
      cidade: form.city,
      cep: form.cep,
      area: parseFloat(form.area),
      quartos: parseInt(form.bedrooms) || 0,
      suites: parseInt(form.suites) || 0,
      banheiros: parseInt(form.bathrooms) || 0,
      vagas: parseInt(form.garages) || 0,
      imagem: form.images.length > 0 ? form.images[0] : "",
      destaque: false,
      latitude: form.lat ? parseFloat(form.lat) : 0,
      longitude: form.lng ? parseFloat(form.lng) : 0,
    };

    setSubmitting(true);

    try {
      const url = isEditing
        ? `${API_BASE}/imoveis/${editingProperty.id}`
        : `${API_BASE}/imoveis`;

      const token = adminToken || (() => { try { return localStorage.getItem('broker_admin_token'); } catch { return null; } })();
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.detail?.[0]?.msg || errData?.detail || `Erro do servidor: ${res.status}`;
        throw new Error(msg);
      }

      const data = await res.json();

      const mapped = {
        id: data.id,
        title: data.titulo,
        description: data.descricao || '',
        type: data.tipo,
        dealType: data.transacao,
        price: data.preco,
        neighborhood: data.bairro,
        city: data.cidade || '',
        cep: data.cep || '',
        area: data.area || 0,
        bedrooms: data.quartos || 0,
        suites: data.suites || 0,
        bathrooms: data.banheiros || 0,
        garages: data.vagas || 0,
        images: data.imagem ? [data.imagem] : [],
        features: form.features,
        badgeType: null,
        lat: data.latitude || null,
        lng: data.longitude || null,
      };

      if (isEditing) {
        setProperties(properties.map(p => p.id === id ? mapped : p));
      } else {
        setProperties([mapped, ...properties]);
      }

      onClose();
    } catch (err) {
      alert(`Erro ao salvar imóvel: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGeocodeByCEP = (e) => {
    e.preventDefault();
    const cep = form.cep?.replace(/\D/g, '');
    if (!cep || cep.length < 8) { alert('Digite um CEP válido primeiro.'); return; }
    geocodeCEP(form.cep)
      .then(({ lat, lng }) => {
        setForm(prev => ({ ...prev, lat: lat.toString(), lng: lng.toString() }));
      })
      .catch(() => alert('Não foi possível obter coordenadas para este CEP.'));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h4 className="text-xl font-extrabold text-slate-900 m-0">
              {isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">Preencha as informações do imóvel abaixo para publicação instantânea.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form id="property-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow text-left">
          <div>
            <h5 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1.5 mb-4">Informações Básicas</h5>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Título do Imóvel *</label>
                <input type="text" placeholder="Ex: Apartamento duplex com vista incrível no Campo Belo"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" required />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Transação</label>
                <select value={form.dealType} onChange={(e) => setForm({ ...form, dealType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-semibold cursor-pointer">
                  <option value="venda">Venda</option><option value="aluguel">Aluguel</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tipo de Imóvel</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-semibold cursor-pointer">
                  <option value="apartamento">Apartamento</option><option value="casa">Casa</option>
                  <option value="terreno">Terreno</option><option value="comercial">Comercial</option>
                </select>
              </div>
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Valor do Imóvel (R$) *</label>
                <input type="number" placeholder="Preço em reais"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" required />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bairro *</label>
                <input type="text" placeholder="Bairro"
                  value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" required />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Cidade *</label>
                <input type="text" placeholder="Cidade"
                  value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" required />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">CEP</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="00000-000"
                    value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
                  <button type="button" onClick={handleGeocodeByCEP}
                    className="px-3 py-2.5 bg-slate-700 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap">
                    Buscar
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Busca coordenadas automaticamente pelo CEP</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Latitude</label>
                <input type="text" placeholder="-23.5703"
                  value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Longitude</label>
                <input type="text" placeholder="-46.6623"
                  value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1.5 mb-4">Dimensões e Características</h5>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Área Útil (m²) *</label>
                <input type="number" placeholder="m²"
                  value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Quartos</label>
                <input type="number" placeholder="Total"
                  value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Suítes</label>
                <input type="number" placeholder="Total"
                  value={form.suites} onChange={(e) => setForm({ ...form, suites: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Banheiros</label>
                <input type="number" placeholder="Total"
                  value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Vagas de Garagem</label>
                <input type="number" placeholder="Total"
                  value={form.garages} onChange={(e) => setForm({ ...form, garages: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descrição do Imóvel</label>
            <textarea rows="4" placeholder="Descreva as qualidades do imóvel, detalhes da localização, pontos fortes..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 leading-relaxed" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Características e Lazer</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {predefinedFeatures.map((feat) => {
                const checked = form.features.includes(feat);
                return (
                  <button type="button" key={feat} onClick={() => handleToggleFeature(feat)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left border flex items-center justify-between transition-colors ${
                      checked ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                    <span>{feat}</span>
                    {checked && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-md">
              <input type="text" placeholder="Outro diferencial..."
                value={customFeature} onChange={(e) => setCustomFeature(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 flex-grow focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              <button type="button" onClick={handleAddCustomFeature}
                className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition-colors">
                Adicionar
              </button>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-1.5 mb-4">Fotos do Imóvel</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <span className="block text-xs font-bold text-slate-700 mb-1">Upload de Computador</span>
                <span className="block text-[11px] text-slate-400 mb-3">Arraste ou escolha fotos locais do seu imóvel.</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
              </div>
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-700 mb-1">Adicionar por URL da Imagem</span>
                  <span className="block text-[11px] text-slate-400 mb-3">Cole uma URL válida do Unsplash, Google Drive ou outro site.</span>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Link da foto (ex: https://...)"
                    value={manualImageUrl} onChange={(e) => setManualImageUrl(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 flex-grow focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button type="button" onClick={handleAddManualImageUrl}
                    className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-900 transition-colors">
                    Vincular
                  </button>
                </div>
              </div>
            </div>
            {form.images.length > 0 && (
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Imagens Carregadas ({form.images.length})</span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-sm rounded-xl transition-all">
            Cancelar
          </button>
          <button type="submit" form="property-form" disabled={submitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Publicar Imóvel')}
          </button>
        </div>
      </div>
    </div>
  );
}
