import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FavoritesButton({ propertyId, className = '', size = 'w-5 h-5', iconOnly = false }) {
  const { favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(propertyId);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); toggleFavorite(propertyId); }}
      className={`${
        iconOnly ? 'p-2 rounded-full' : 'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all'
      } ${
        isFavorite
          ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
          : 'bg-white text-slate-400 border-slate-200 hover:text-red-400 hover:border-red-200'
      } ${className}`}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart className={`${size} ${isFavorite ? 'fill-red-500' : ''} transition-colors`} />
      {!iconOnly && (isFavorite ? 'Favoritado' : 'Favoritar')}
    </button>
  );
}
