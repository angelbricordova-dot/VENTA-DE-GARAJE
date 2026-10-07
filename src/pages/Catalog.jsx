import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../config'

const STATUS_TABS = [
  { key: 'all',       label: 'Todos' },
  { key: 'available', label: '✅ Disponibles' },
  { key: 'pending',   label: '🕐 Apartados' },
  { key: 'sold',      label: '🎊 Vendidos' },
]

export default function Catalog() {
  const { products } = useProducts()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filtered = useMemo(() => {
    return products
      .filter(p => statusFilter === 'all' || p.status === statusFilter)
      .filter(p => categoryFilter === 'all' || p.category === categoryFilter)
      .filter(p => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
        )
      })
  }, [products, statusFilter, categoryFilter, search])

  const usedCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))]
    return cats.sort()
  }, [products])

  const countByStatus = useMemo(() => ({
    all:       products.length,
    available: products.filter(p => p.status === 'available').length,
    pending:   products.filter(p => p.status === 'pending').length,
    sold:      products.filter(p => p.status === 'sold').length,
  }), [products])

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Catálogo completo</h1>
        <p className="text-gray-500 mt-1">{products.length} artículos en total · {countByStatus.available} disponibles ahora</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar artículos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-11 pr-10"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              statusFilter === tab.key
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${statusFilter === tab.key ? 'text-white/80' : 'text-gray-400'}`}>
              {countByStatus[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Category filter */}
      {usedCategories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-7 items-center">
          <SlidersHorizontal size={15} className="text-gray-400" />
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              categoryFilter === 'all'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todas las categorías
          </button>
          {usedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                categoryFilter === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length > 0 ? (
        <>
          <p className="text-xs text-gray-400 mb-4">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-gray-600">No se encontraron artículos</p>
          <p className="text-sm mt-1">Intenta con otro término o elimina los filtros</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all') }}
            className="btn-secondary mt-4"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  )
}
