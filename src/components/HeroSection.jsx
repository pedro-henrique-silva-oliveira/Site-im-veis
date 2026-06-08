import { Search, Filter, Home } from 'lucide-react';

const selectArrow = {
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  backgroundSize: '18px',
};

export default function HeroSection({
  searchQuery, setSearchQuery,
  dealTypeFilter, setDealTypeFilter,
  propertyTypeFilter, setPropertyTypeFilter,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  bedroomsFilter, setBedroomsFilter,
  isMobileFiltersOpen, setIsMobileFiltersOpen,
  handleResetFilters, filteredCount,
}) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden py-16 sm:py-28">
      <div className="absolute inset-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Imóveis"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-emerald-300 font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-md border border-white/5 shadow-inner">
          <Home className="w-3.5 h-3.5" /> Imóveis para cada momento da sua vida
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto m-0 p-0 mb-4 drop-shadow-lg">
          O lar perfeito para o seu momento
        </h2>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Do primeiro aluguel ao imóvel dos sonhos. Temos a opção certa esperando por você.
        </p>

        <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl text-slate-800 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:flex-[2]">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Busque por bairro, cidade ou código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 rounded-xl border-2 border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold placeholder:text-slate-400"
              />
            </div>

            <div className="w-full md:flex-1">
              <select
                value={dealTypeFilter}
                onChange={(e) => setDealTypeFilter(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold appearance-none cursor-pointer"
                style={selectArrow}
              >
                <option value="todos">Venda ou Locação</option>
                <option value="venda">Para Comprar</option>
                <option value="aluguel">Para Alugar</option>
              </select>
            </div>

            <div className="w-full md:flex-1">
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold appearance-none cursor-pointer"
                style={selectArrow}
              >
                <option value="todos">Todos os tipos</option>
                <option value="casa">Casas</option>
                <option value="apartamento">Apartamentos</option>
                <option value="terreno">Terrenos</option>
                <option value="comercial">Comerciais</option>
              </select>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              title="Filtros avançados"
              className={`w-full md:w-auto px-5 py-3.5 rounded-xl border-2 flex items-center justify-center transition-all font-semibold text-base gap-2 flex-shrink-0 ${
                isMobileFiltersOpen || minPrice || maxPrice || bedroomsFilter !== 'todos'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Filtros</span>
            </button>
          </div>

          {(isMobileFiltersOpen || minPrice || maxPrice || bedroomsFilter !== 'todos') && (
            <div className="mt-5 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preço Mínimo (R$)</label>
                <input
                  type="number" placeholder="Mínimo" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preço Máximo (R$)</label>
                <input
                  type="number" placeholder="Máximo" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border-2 border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quartos Mínimo</label>
                <div className="flex gap-1.5">
                  {['todos', '1', '2', '3', '4+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBedroomsFilter(opt)}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg border-2 transition-all ${
                        bedroomsFilter === opt
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt === 'todos' ? 'Qq' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(searchQuery || dealTypeFilter !== 'todos' || propertyTypeFilter !== 'todos' || minPrice || maxPrice || bedroomsFilter !== 'todos') && (
            <div className="mt-4 flex items-center justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">
                Filtros ativos. Encontrados: <strong className="text-emerald-600 text-base">{filteredCount} imóveis</strong>.
              </span>
              <button onClick={handleResetFilters} className="text-emerald-600 hover:text-emerald-800 font-bold hover:underline transition-colors">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
