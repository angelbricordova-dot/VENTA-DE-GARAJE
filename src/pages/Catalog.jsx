import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import BundleCard from '../components/BundleCard'
import { useProducts } from '../hooks/useProducts'
import { useBundles } from '../hooks/useBundles'
import { CATEGORIES } from '../config'

const STATUS_TABS = [
  { key: 'all',       label: 'Todos' },
  { key: 'available', label: '✅ Disponibles' },
  { key: 'pending',   label: '🕐 Apartados' },
  { key: 'sold',      label: '🎊 Vendidos' },
]

const SORT_OPTIONS = [
  { key: 'newest',     label: 'Recientes' },
  { key: 'price_asc',  label: '↑ Precio' },
  { key: 'price_desc', label: '↓ Precio' },
]

export default function Catalog() {
  const { products } = useProducts()
  const { bundles } = useBundles()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const publicProducts = useMemo(() => products.filter(p => p.status !== 'draft'), [products])
  const activeBundles = useMemo(() => bundles.filter(b => b.status === 'active'), [bundles])

  const filtered = useMemo(() => {
    return publicProducts
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
  }, [publicProducts, statusFilter, categoryFilter, search])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'price_asc')  arr.sort((a, b) => Number(a.price) - Number(b.price))
    if (sortBy === 'price_desc') arr.sort((a, b) => Number(b.price) - Number(a.price))
    return arr
  }, [filtered, sortBy])

  const usedCategories = useMemo(() => {
    const cats = [...new Set(publicProducts.map(p => p.category).filter(Boolean))]
    return cats.sort()
  }, [publicProducts])

  const countByStatus = useMemo(() => ({
    all:       publicProducts.length,
    available: publicProducts.filter(p => p.status === 'available').length,
    pending:   publicProducts.filter(p => p.status === 'pending').length,
    sold:      publicProducts.filter(p => p.status === 'sold').length,
  }), [publicProducts])

  const clearAll = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setSortBy('newest')
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Catálogo completo</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{publicProducts.length} artículos en total · {countByStatus.available} disponibles ahora</p>
      </div>

      {/* Bundles section */}
      {activeBundles.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎁</span>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Packs y Promociones</h2>
            <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeBundles.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBundles.map(b => <BundleCard key={b.id} bundle={b} products={publicProducts} />)}
          </div>
          <div className="h-px bg-gray-100 mt-10" />
        </div>
      )}

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
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
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
        <div className="flex gap-2 flex-wrap mb-5 items-center">
          <SlidersHorizontal size={15} className="text-gray-400" />
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              categoryFilter === 'all'
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
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
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Sort + results count */}
      {sorted.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <p className="text-xs text-gray-400">{sorted.length} resultado{sorted.length !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={13} className="text-gray-400" />
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.key}
                  onClick={() => setSortBy(o.key)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all border ${
                    sortBy === o.key
                      ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-gray-600 dark:text-gray-400">No se encontraron artículos</p>
          <p className="text-sm mt-1">Intenta con otro término o elimina los filtros</p>
          <button onClick={clearAll} className="btn-secondary mt-4">
            Limpiar filtros
          </button>
        </div>
      )}
    </main>
  )
}
