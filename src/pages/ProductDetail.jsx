import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Share2, Tag, Package, MapPin } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useProducts } from '../hooks/useProducts'
import { useSettings } from '../hooks/useAdmin'
import { SITE_CONFIG } from '../config'

function buildWhatsappLink(phone, product) {
  const msg = encodeURIComponent(
    `Hola! Me interesa *${product.title}* que vi en tu venta de garaje. Sigue disponible?`
  )
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { settings } = useSettings()

  const product = products.find(p => p.id === id)
  const phone = settings.whatsapp || SITE_CONFIG.whatsappNumber
  const isSold = product?.status === 'sold'

  if (!product) {
    return (
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔦</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Artículo no encontrado</h1>
        <p className="text-gray-500 mb-6">Es posible que haya sido eliminado o el enlace sea incorrecto.</p>
        <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
      </main>
    )
  }

  const related = products
    .filter(p => p.id !== product.id && p.category === product.category && p.status !== 'sold')
    .slice(0, 3)

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.title, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      alert('¡Enlace copiado!')
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-square">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="product-image-placeholder w-full h-full flex items-center justify-center text-7xl">🏷️</div>
          )}
          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white font-black text-2xl px-8 py-3 rounded-2xl rotate-[-12deg] shadow-lg">
                VENDIDO
              </span>
            </div>
          )}
          {product.originalPrice && !isSold && (
            <div className="absolute top-4 right-4 bg-brand-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            {product.category && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium mb-2">
                <Tag size={12} /> {product.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={product.status} />
            {product.condition && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{product.condition}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-gray-900">
              ${product.price}
              <span className="text-lg font-normal text-gray-400 ml-1">{product.currency}</span>
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through font-medium">${product.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Delivery note */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <MapPin size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-amber-800">Entregas disponibles</span>
              <p className="text-amber-700 mt-0.5">Maracay (Lun–Vie) · Caracas (Lun–Vie) · Valencia (Sáb–Dom) · Nacional MRW/Zoom</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 mt-auto">
            {!isSold ? (
              <>
                <a
                  href={buildWhatsappLink(phone, product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full py-4 text-base"
                >
                  <MessageCircle size={20} />
                  Quiero este artículo — WhatsApp
                </a>
                <button onClick={handleShare} className="btn-secondary w-full">
                  <Share2 size={16} /> Compartir
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-3 text-sm">Este artículo ya fue vendido.</p>
                <Link to="/catalogo" className="btn-primary">Ver artículos disponibles</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Más de {product.category}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {related.map(p => (
              <Link
                key={p.id}
                to={`/producto/${p.id}`}
                className="card flex flex-col group"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="product-image-placeholder w-full h-full flex items-center justify-center text-3xl">🏷️</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">{p.title}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">${p.price} <span className="font-normal text-gray-400 text-xs">{p.currency}</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
