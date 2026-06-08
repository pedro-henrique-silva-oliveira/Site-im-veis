import { useState, useMemo } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import PropertyCard from '../components/PropertyCard';
import BenefitsSection from '../components/BenefitsSection';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { properties, isLoading, apiError, favorites, fetchProperties, pagina, totalPaginas, totalPropriedades } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState('todos');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('todos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('todos');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(prop => {
      const matchesSearch =
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.id && prop.id.toString() === searchQuery.trim());

      const matchesDealType = dealTypeFilter === 'todos' || prop.dealType === dealTypeFilter;
      const matchesPropertyType = propertyTypeFilter === 'todos' || prop.type === propertyTypeFilter;

      let matchesBedrooms = true;
      if (bedroomsFilter !== 'todos') {
        matchesBedrooms = bedroomsFilter === '4+' ? prop.bedrooms >= 4 : prop.bedrooms === parseInt(bedroomsFilter);
      }

      const priceNum = parseFloat(prop.price);
      const minPriceNum = minPrice !== '' ? parseFloat(minPrice) : 0;
      const maxPriceNum = maxPrice !== '' ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = priceNum >= minPriceNum && priceNum <= maxPriceNum;

      const matchesFavorites = showFavoritesOnly ? favorites.includes(prop.id) : true;

      return matchesSearch && matchesDealType && matchesPropertyType && matchesBedrooms && matchesPrice && matchesFavorites;
    });

    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'area-desc': filtered.sort((a, b) => b.area - a.area); break;
      case 'newest': filtered.sort((a, b) => (b.id > a.id ? 1 : -1)); break;
    }

    return filtered;
  }, [properties, searchQuery, dealTypeFilter, propertyTypeFilter, minPrice, maxPrice, bedroomsFilter, sortOption, showFavoritesOnly, favorites]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDealTypeFilter('todos');
    setPropertyTypeFilter('todos');
    setMinPrice('');
    setMaxPrice('');
    setBedroomsFilter('todos');
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    await fetchProperties(pagina + 1, true);
    setLoadingMore(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pedro H. Corretor - Imóveis sob medida para o seu momento</title>
        <meta name="description" content="Do primeiro aluguel ao imóvel dos sonhos. Carteira variada de imóveis em São Paulo, Barueri, Rio de Janeiro e Campinas para todos os momentos da sua vida." />
        <meta property="og:title" content="Pedro H. Corretor - Imóveis sob medida para o seu momento" />
        <meta property="og:description" content="Do primeiro aluguel ao imóvel dos sonhos. Encontre o lar perfeito para o seu momento." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" />
      </Helmet>

      <HeroSection
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        dealTypeFilter={dealTypeFilter} setDealTypeFilter={setDealTypeFilter}
        propertyTypeFilter={propertyTypeFilter} setPropertyTypeFilter={setPropertyTypeFilter}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        bedroomsFilter={bedroomsFilter} setBedroomsFilter={setBedroomsFilter}
        isMobileFiltersOpen={isMobileFiltersOpen} setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        handleResetFilters={handleResetFilters}
        filteredCount={filteredProperties.length}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {apiError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-700 mb-2">Erro ao carregar imóveis</h3>
            <p className="text-red-600 text-sm mb-4">{apiError}</p>
            <button onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors">
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none m-0">Imóveis Disponíveis</h3>
                <p className="text-slate-500 mt-2 text-sm">Do popular ao luxo. Opções para comprar, alugar e viver bem.</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="newest">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="area-desc">Maior área</option>
                </select>

                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    showFavoritesOnly
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {showFavoritesOnly ? 'Mostrando favoritos' : 'Favoritos'}
                </button>

                <div className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start font-medium shadow-sm">
                  Exibindo <strong className="text-slate-800">{properties.length}</strong> de <strong className="text-slate-800">{totalPropriedades}</strong> listados
                </div>
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {pagina < totalPaginas && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {loadingMore ? 'Carregando...' : `Carregar mais imóveis (${totalPropriedades - properties.length} restantes)`}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl py-16 px-4 text-center border border-slate-200 max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Nenhum imóvel corresponde aos filtros</h4>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Tente relaxar os parâmetros de busca ou redefina os filtros para encontrar mais opções de imóveis.
                </p>
                <button onClick={handleResetFilters} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-lg">
                  Resetar Filtros de Busca
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <BenefitsSection />
    </>
  );
}