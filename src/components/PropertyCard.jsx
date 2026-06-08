import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, ArrowRight, ImageOff } from 'lucide-react';
import { formatPrice, generatePropertyUrl } from '../utils/formatters';
import FavoritesButton from './FavoritesButton';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
      onClick={() => navigate(generatePropertyUrl(property.id))}
    >
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <ImageOff className="w-12 h-12 text-slate-400" />
          </div>
        ) : (
          <img
            src={property.images?.[0] || FALLBACK_IMG}
            alt={property.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className={`px-3 py-1.5 text-xs font-extrabold rounded-lg tracking-wide uppercase shadow ${
            property.dealType === 'venda'
              ? 'bg-indigo-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}>
            {property.dealType === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
          <span className="px-3 py-1.5 text-xs font-extrabold bg-slate-900/85 text-white backdrop-blur-sm rounded-lg tracking-wide uppercase shadow">
            {property.type}
          </span>
        </div>

        {property.badgeType && (
          <div className="absolute top-16 left-4">
            <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg ${
              property.badgeType === 'luxury'
                ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-white'
                : property.badgeType === 'opportunity'
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-500 text-white'
            }`}>
              {property.badgeType === 'luxury' ? 'Alto Padrão' : property.badgeType === 'opportunity' ? 'Oportunidade' : 'Lançamento'}
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <FavoritesButton propertyId={property.id} iconOnly={true} className="bg-white/90 hover:bg-white shadow" size="w-5 h-5" />
        </div>

        <div className="absolute bottom-4 right-4 bg-slate-950/75 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-bold rounded">
          {property.area} m²
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center text-indigo-600 font-bold text-xs uppercase tracking-widest gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 inline text-indigo-500" />
            <span>{property.neighborhood}, {property.city}</span>
          </div>

          <h4 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors m-0 p-0 mb-3">
            {property.title}
          </h4>

          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
            <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-400" /> {property.bedrooms} Qts</span>
            <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-400" /> {property.bathrooms} Ban</span>
            <span className="flex items-center gap-1"><Car className="w-4 h-4 text-slate-400" /> {property.garages} Vg</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Valor do imóvel</span>
              <strong className="text-xl font-extrabold text-slate-950">
                {formatPrice(property.price, property.dealType)}
              </strong>
            </div>
            <span className="w-10 h-10 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center transition-colors duration-200">
              <ArrowRight className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
