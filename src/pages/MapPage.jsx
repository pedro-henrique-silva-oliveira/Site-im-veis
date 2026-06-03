import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ArrowLeft, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../context/AppContext';
import { formatPrice, generatePropertyUrl, geocodeProperty } from '../utils/formatters';
import L from 'leaflet';

const defaultIcon = L.divIcon({
  html: '<div style="background:#4f46e5;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(79,70,229,0.4);border:2px solid #fff;">🏠</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -36],
});

export default function MapPage() {
  const { properties, setProperties } = useApp();
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState(null);
  const running = useRef(false);

  const withCoords = properties.filter(p => p.lat && p.lng);
  const withoutCoords = properties.filter(p => p.cep && (!p.lat || !p.lng));

  useEffect(() => {
    if (withoutCoords.length === 0 || running.current) return;
    running.current = true;

    setTimeout(() => {
      setGeocoding(true);
      let idx = 0;
      const next = () => {
        if (idx >= withoutCoords.length) { setGeocoding(false); return; }
        const p = withoutCoords[idx++];
        geocodeProperty(p)
          .then(({ lat, lng }) => {
            setProperties(prev => prev.map(prop =>
              prop.id === p.id ? { ...prop, lat, lng } : prop
            ));
          })
          .catch(err => {
            console.warn('Falha ao geocodificar CEP', p.cep, err?.message || err);
            if (!geocodeError) setGeocodeError(`Alguns CEPs não puderam ser localizados. Clique no link "Mapa" ao lado do imóvel para abrir no Google Maps.`);
          })
          .finally(() => setTimeout(next, 300));
      };
      next();
    }, 0);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const center = withCoords.length > 0
    ? [
        withCoords.reduce((s, p) => s + p.lat, 0) / withCoords.length,
        withCoords.reduce((s, p) => s + p.lng, 0) / withCoords.length,
      ]
    : [-15.7939, -47.8822];

  return (
    <>
      <Helmet>
        <title>Mapa de Imóveis - Pedro H. Corretor</title>
        <meta name="description" content="Visualize todos os imóveis disponíveis no mapa." />
      </Helmet>

      <div className="relative">
        <div className="absolute top-4 left-4 z-[1000] flex items-start gap-3">
          <Link to="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm text-slate-700 font-bold text-sm rounded-xl shadow-lg border border-slate-200 hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-4 py-2.5">
            <h1 className="text-sm font-extrabold text-slate-900">Mapa de Imóveis</h1>
            <p className="text-[11px] text-slate-500">
              {geocoding
                ? 'Buscando endereços...'
                : `${withCoords.length} de ${properties.length} imóveis`}
            </p>
          </div>
        </div>

        {geocoding && (
          <div className="absolute top-20 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold text-slate-600">Geocodificando CEPs via Google...</span>
          </div>
        )}

        {geocodeError && (
          <div className="absolute top-32 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 px-4 py-3 flex items-start gap-3 max-w-md shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-600">{geocodeError}</p>
          </div>
        )}

        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 w-80 max-h-[85vh] flex flex-col shadow-sm">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Todos os Imóveis</p>
            <span className="text-[10px] font-bold text-slate-400">{properties.length} itens</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {properties.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum imóvel cadastrado</p>
            ) : (
              properties.map(p => {
                const hasCoord = p.lat && p.lng;
                return (
                  <div key={p.id}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs transition-colors border ${
                      hasCoord
                        ? 'border-green-100 bg-green-50/50'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasCoord ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.neighborhood}, {p.city}</p>
                    </div>
                    {hasCoord ? (
                      <span className="text-[10px] text-green-600 font-semibold whitespace-nowrap">No mapa</span>
                    ) : (
                      <a href={`https://www.google.com/maps?q=${encodeURIComponent(p.cep)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-0.5 whitespace-nowrap"
                      >
                        <ExternalLink className="w-3 h-3" /> Mapa
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={5}
          className="w-full"
          style={{ height: '100vh' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {withCoords.map(property => (
            <Marker
              key={property.id}
              position={[property.lat, property.lng]}
              icon={defaultIcon}
            >
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <div className="flex gap-3 mb-2">
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      {property.images?.[0] && (
                        <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">{property.title}</p>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">{property.neighborhood}, {property.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <strong className="text-sm font-black text-slate-950">{formatPrice(property.price, property.dealType)}</strong>
                    <Link to={generatePropertyUrl(property.id)}
                      className="text-[10px] px-2.5 py-1 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Ver Imóvel
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
