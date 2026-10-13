import { MessageCircle } from 'lucide-react'
import { useSettings } from '../hooks/useAdmin'
import { SITE_CONFIG } from '../config'

export default function BundleCard({ bundle, products }) {
  const { settings } = useSettings()
  const phone = settings.whatsapp || SITE_CONFIG.whatsappNumber

  const bundleProducts = (bundle.productIds || [])
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  const originalTotal = bundleProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
  const savings = originalTotal > bundle.price
    ? Math.round((1 - bundle.price / originalTotal) * 100)
    : 0

  const waLink = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola! Me interesa el pack *${bundle.title}* que vi en tu venta de garaje. Sigue disponible?`
  )}`

  return (
    <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-amber-100 flex flex-col">
      {/* Thumbnails */}
      <div className="relative bg-gradient-to-r from-amber-50 to-brand-50 p-4">
        {savings > 0 && (
          <div className="absolute top-3 right-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-xl">
            -{savings}% OFF
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {bundleProducts.slice(0, 4).map(p => (
            <div key={p.id} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-sm shrink-0">
              {p.imageUrl || (p.images && p.images[0]) ? (
                <img
                  src={p.imageUrl || p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🏷️</div>
              )}
            </div>
          ))}
          {bundleProducts.length > 4 && (
            <div className="w-16 h-16 rounded-xl bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-500">
              +{bundleProducts.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{bundle.title}</h3>
          {bundle.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{bundle.description}</p>
          )}
        </div>

        {/* Items */}
        <div className="flex flex-col gap-0.5">
          {bundleProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate flex-1 mr-2">• {p.title}</span>
              <span className="font-medium shrink-0">${p.price} {p.currency}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          <span className="text-2xl font-black text-gray-900">
            ${bundle.price}
            <span className="text-sm font-normal text-gray-400 ml-1">{bundle.currency || 'USD'}</span>
          </span>
          {savings > 0 && originalTotal > 0 && (
            <span className="text-sm text-gray-400 line-through font-medium">${originalTotal}</span>
          )}
          {savings > 0 && (
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              🎉 Ahorras ${originalTotal - bundle.price}
            </span>
          )}
        </div>

        {/* CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp w-full"
        >
          <MessageCircle size={16} /> Me interesa este pack
        </a>
      </div>
    </div>
  )
}
