import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice, generatePropertyUrl } from '../utils/formatters';

export default function RelatedProperties({ currentProperty, limit = 3 }) {
  const { properties } = useApp();
  const navigate = useNavigate();

  const related = properties
    .filter(p => p.id !== currentProperty.id)
    .filter(p => p.type === currentProperty.type || p.dealType === currentProperty.dealType || p.city === currentProperty.city)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <div>
      <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">Imóveis Relacionados</h5>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map(property => (
          <div
            key={property.id}
            onClick={() => navigate(generatePropertyUrl(property.id))}
            className="group bg-white rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="h-40 overflow-hidden bg-slate-100">
              <img
                src={property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider mb-1.5 ${
                property.dealType === 'venda' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {property.dealType === 'venda' ? 'Venda' : 'Aluguel'}
              </span>
              <h6 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">{property.title}</h6>
              <p className="text-indigo-600 text-sm font-extrabold mt-1">{formatPrice(property.price, property.dealType)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
