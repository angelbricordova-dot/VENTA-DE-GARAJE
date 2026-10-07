import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useSettings } from '../hooks/useAdmin'

function buildWhatsappLink(phone, product) {
  const msg = encodeURIComponent(
    `Hola! 👋 Me interesa *${product.title}* que vi en tu venta de garaje. ¿Sigue disponible?`
  )
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`
}

export default function ProductCard({ product }) {
  const { settings } = useSettings()
  const isSold = product.status === 'sold'

  return (
    <div className={`card group flex flex-col ${isSold ? 'opacity-70' : ''}`}>
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div
          className="product-image-placeholder w-full h-full flex items-center justify-center text-4xl"
          style={{ display: product.imageUrl ? 'none' : 'flex' }}
        >
          🏷️
        </div>
        {isSold && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="badge-sold text-sm font-bold px-4 py-2">Vendido</span>
          </div>
        )}
        {product.originalPrice && !isSold && (
          <div className="absolute top-2 right-2 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/producto/${product.id}`}
            className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-brand-600 transition-colors flex-1"
          >
            {product.title}
          </Link>
          <StatusBadge status={product.status} />
        </div>

        {product.category && (
          <span className="text-xs text-gray-400">{product.category} · {product.condition}</span>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price} <span className="text-xs font-normal text-gray-500">{product.currency}</span>
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        {!isSold && (
          <a
            href={buildWhatsappLink(settings.whatsapp, product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full mt-1"
            onClick={e => e.stopPropagation()}
          >
            <MessageCircle size={16} />
            Lo quiero
          </a>
        )}
      </div>
    </div>
  )
}
