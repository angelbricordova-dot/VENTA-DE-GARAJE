import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useSettings } from '../hooks/useAdmin'

function buildWhatsappLink(phone, product) {
  const msg = encodeURIComponent(
    `Hola! Me interesa *${product.title}* que vi en tu venta de garaje. Sigue disponible?`
  )
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`
}

export default function ProductCard({ product }) {
  const { settings } = useSettings()
  const isSold = product.status === 'sold'
  const imgRef = useRef(null)

  const tiltImg = (e) => {
    if (!imgRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top)  / r.height
    imgRef.current.style.transform =
      `perspective(600px) rotateX(${(0.5 - y) * 14}deg) rotateY(${(x - 0.5) * 14}deg) scale(1.06)`
  }
  const resetImg = () => {
    if (imgRef.current) imgRef.current.style.transform = ''
  }

  return (
    <div className={`card group flex flex-col h-full ${isSold ? 'opacity-70' : ''}`}>
      {/* Image */}
      <Link
        to={`/producto/${product.id}`}
        className="block relative overflow-hidden aspect-[4/3] bg-gray-100"
        onMouseMove={tiltImg}
        onMouseLeave={resetImg}
      >
        {product.imageUrl ? (
          <img
            ref={imgRef}
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ transition: 'transform 0.15s ease-out' }}
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
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/producto/${product.id}`}
            className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2 hover:text-brand-600 transition-colors flex-1"
          >
            {product.title}
          </Link>
          <StatusBadge status={product.status} />
        </div>

        {product.category && (
          <span className="text-xs text-gray-400">{product.category} · {product.condition}</span>
        )}
        {product.size && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full w-fit">
            Talla {product.size}
          </span>
        )}
        {product.stock > 0 && product.status === 'available' && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full w-fit ${
            product.stock === 1
              ? 'text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400'
              : 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            {product.stock === 1 ? '⚡ Última unidad' : `📦 ${product.stock} disponibles`}
          </span>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-1.5 flex-wrap">
          <span className="text-base font-bold text-gray-900 dark:text-gray-100">
            ${product.price} <span className="text-xs font-normal text-gray-500">{product.currency}</span>
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
          )}
          {product.negotiable && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Negociable</span>
          )}
        </div>

        {!isSold && (
          <a
            href={buildWhatsappLink(settings.whatsapp, product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full mt-1 text-xs py-2"
            onClick={e => e.stopPropagation()}
          >
            <MessageCircle size={14} />
            Lo quiero
          </a>
        )}
      </div>
    </div>
  )
}
