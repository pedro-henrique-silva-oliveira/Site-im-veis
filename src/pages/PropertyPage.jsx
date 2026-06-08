import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Check, ChevronLeft, ChevronRight, ArrowLeft, ImageOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import ImageLightbox from '../components/ImageLightbox';
import ScheduleVisit from '../components/ScheduleVisit';
import FinanceCalculator from '../components/FinanceCalculator';
import RelatedProperties from '../components/RelatedProperties';
import FavoritesButton from '../components/FavoritesButton';

export default function PropertyPage() {
  const { id } = useParams();
  const { properties } = useApp();
  const property = properties.find(p => p.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mainImgError, setMainImgError] = useState(false);
  const [thumbErrors, setThumbErrors] = useState([]);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Imóvel não encontrado</h2>
        <p className="text-slate-500 mb-6">O imóvel que você procura não está disponível ou foi removido.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para Imóveis
        </Link>
      </div>
    );
  }

  const images = property.images?.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: images[0],
    url: window.location.href,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Helmet>
        <title>{property.title} — Pedro H. Corretor</title>
        <meta name="description" content={property.description?.slice(0, 160) || `${property.title} em ${property.neighborhood}, ${property.city} — ${formatPrice(property.price, property.dealType)}. Fale comigo e encontre o imóvel ideal para o seu momento.`} />
        <meta property="og:title" content={`${property.title} — Pedro H. Corretor`} />
        <meta property="og:description" content={property.description?.slice(0, 200) || `Imóvel em ${property.neighborhood}, ${property.city}`} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para lista de imóveis
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer"
              onClick={() => setLightboxOpen(true)}>
              {mainImgError ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <ImageOff className="w-16 h-16 text-slate-400" />
                </div>
              ) : (
                <img src={images[activeImageIndex]} alt={property.title} onError={() => setMainImgError(true)} className="w-full h-full object-cover" />
              )}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-white/90 text-slate-800 text-sm font-bold rounded-xl shadow">
                  Clique para ampliar
                </span>
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, idx) => (
                    <span key={idx} className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === idx ? 'bg-indigo-600 scale-125' : 'bg-white/60'}`} />
                  ))}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? 'border-indigo-600 scale-95 shadow' : 'border-transparent'}`}>
                    {thumbErrors.includes(idx) ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <ImageOff className="w-4 h-4 text-slate-400" />
                      </div>
                    ) : (
                      <img src={img} alt="" onError={() => setThumbErrors(prev => [...prev, idx])} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-4 gap-4 text-center">
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Área útil</span>
                <strong className="text-lg font-black text-slate-900 block mt-1">{property.area} m²</strong>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Quartos</span>
                <strong className="text-lg font-black text-slate-900 block mt-1">{property.bedrooms} ({property.suites} suíte)</strong>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Banheiros</span>
                <strong className="text-lg font-black text-slate-900 block mt-1">{property.bathrooms}</strong>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Vagas</span>
                <strong className="text-lg font-black text-slate-900 block mt-1">{property.garages}</strong>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">Descrição do Imóvel</h5>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>

            {property.features?.length > 0 && (
              <div>
                <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3.5">Características e Lazer</h5>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(property.cep)}&output=embed`}
                title="Localização"
                className="w-full h-64 rounded-2xl border border-slate-200"
                loading="lazy"
                allowFullScreen
              />
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {property.neighborhood}, {property.city}{property.cep ? ` — CEP: ${property.cep}` : ''}
              </p>
            </div>

            <RelatedProperties currentProperty={property} />
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-indigo-300 font-bold text-xs uppercase tracking-widest gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5 inline text-indigo-400" />
                  <span>{property.neighborhood}, {property.city}</span>
                </div>
                <FavoritesButton propertyId={property.id} iconOnly={true} className="bg-white/10 hover:bg-white/20" size="w-5 h-5" />
              </div>
              <span className="text-[10px] text-indigo-200/60 block font-bold uppercase tracking-wider">Valor do Investimento</span>
              <strong className="text-3xl font-black block mt-1 tracking-tight">{formatPrice(property.price, property.dealType)}</strong>
              <span className="text-xs text-indigo-200/70 block mt-1 font-medium">Livre de pendências judiciais ou fiscais.</span>
              <div className="mt-4 flex gap-2">
                <button onClick={() => window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(`Olá! Vi o imóvel "${property.title}" (Ref: ${property.id}) em seu site e gostaria de obter mais informações.`)}`, '_blank')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> WhatsApp
                </button>
                <FavoritesButton propertyId={property.id} className="flex-shrink-0" size="w-4 h-4" />
              </div>
            </div>

            <ScheduleVisit property={property} />
            <FinanceCalculator price={property.price} />

            <div className="text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ref: {property.id}</span>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          activeIndex={activeImageIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
          onNext={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
        />
      )}
    </>
  );
}
