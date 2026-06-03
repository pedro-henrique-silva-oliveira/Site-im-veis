import { Sparkles, Search, Filter } from 'lucide-react';

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
    <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          alt="Background Luxury House"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-indigo-300 font-semibold text-xs tracking-wider uppercase mb-6 backdrop-blur-md border border-white/5">
          <Sparkles className="w-3.5 h-3.5" /> Curadoria Exclusiva de Imóveis
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto m-0 p-0 mb-4">
          O imóvel dos seus sonhos, selecionado a dedo.
        </h2>
        <p className="text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
          Sem intermediários. Atendimento exclusivo de ponta a ponta para que você faça o melhor negócio.
        </p>

        <div className="max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-xl text-slate-800 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Busque por bairro, cidade ou código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={dealTypeFilter}
                onChange={(e) => setDealTypeFilter(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-medium appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px'
                }}
              >
                <option value="todos">Venda ou Locação</option>
                <option value="venda">Para Comprar</option>
                <option value="aluguel">Para Alugar</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 font-medium appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px'
                }}
              >
                <option value="todos">Todos os tipos</option>
                <option value="casa">Casas</option>
                <option value="apartamento">Apartamentos</option>
                <option value="terreno">Terrenos</option>
                <option value="comercial">Comerciais</option>
              </select>
            </div>

            <div className="md:col-span-1 flex gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                title="Filtros avançados"
                className={`flex-grow md:flex-none p-3 rounded-xl border flex items-center justify-center transition-colors ${
                  isMobileFiltersOpen || minPrice || maxPrice || bedroomsFilter !== 'todos'
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {(isMobileFiltersOpen || minPrice || maxPrice || bedroomsFilter !== 'todos') && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Preço Mínimo (R$)</label>
                <input
                  type="number" placeholder="Mínimo" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Preço Máximo (R$)</label>
                <input
                  type="number" placeholder="Máximo" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quartos Mínimo</label>
                <div className="flex gap-1">
                  {['todos', '1', '2', '3', '4+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBedroomsFilter(opt)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        bedroomsFilter === opt
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt === 'todos' ? 'Qualquer' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(searchQuery || dealTypeFilter !== 'todos' || propertyTypeFilter !== 'todos' || minPrice || maxPrice || bedroomsFilter !== 'todos') && (
            <div className="mt-3.5 flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-medium">
                Filtros ativos. Encontrados: <strong className="text-indigo-600">{filteredCount} imóveis</strong>.
              </span>
              <button onClick={handleResetFilters} className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline">
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
