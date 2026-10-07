import { Link } from 'react-router-dom'
import { ArrowRight, Tag, Star, Truck, MessageCircle, Facebook, Music2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import DeliveryInfo from '../components/DeliveryInfo'
import { useProducts } from '../hooks/useProducts'
import { useSettings } from '../hooks/useAdmin'
import { SITE_CONFIG } from '../config'

export default function Home() {
  const { products } = useProducts()
  const { settings } = useSettings()

  const available = products.filter(p => p.status === 'available')
  const featured = products.filter(p => p.status !== 'sold').slice(0, 6)
  const soldCount = products.filter(p => p.status === 'sold').length

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-amber-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🏷️</div>
          <div className="absolute top-1/3 right-16 text-6xl">📦</div>
          <div className="absolute bottom-12 left-1/4 text-5xl">✨</div>
          <div className="absolute bottom-6 right-1/3 text-7xl">💸</div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center text-white">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🎉 {available.length} artículos disponibles ahora mismo
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            ¡Gran Venta<br />de Garaje! 🏷️
          </h1>
          <p className="text-lg sm:text-xl text-white/85 max-w-xl mx-auto mb-8">
            Artículos usados en excelente estado a precios increíbles.<br />
            Encontralos, escríbeme y ¡listo!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalogo" className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-7 py-3.5 rounded-xl hover:bg-brand-50 transition-colors text-base active:scale-95">
              Ver catálogo completo <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${(settings.whatsapp || SITE_CONFIG.whatsappNumber).replace(/\D/g,'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-xl hover:bg-[#1ebe57] transition-colors text-base active:scale-95"
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { label: 'Disponibles', value: available.length, icon: '✅' },
            { label: 'Artículos en total', value: products.length, icon: '📦' },
            { label: 'Ya vendidos', value: soldCount, icon: '🎊' },
            { label: 'Ciudades de entrega', value: '3+', icon: '📍' },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-black text-brand-400">{s.icon} {s.value}</span>
              <span className="text-gray-400 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured products ── */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Artículos destacados</h2>
            <p className="text-gray-500 mt-1 text-sm">Los más recientes y en mejores condiciones</p>
          </div>
          <Link to="/catalogo" className="text-brand-600 font-semibold text-sm hover:text-brand-700 flex items-center gap-1">
            Ver todos <ArrowRight size={15} />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Tag size={40} className="mx-auto mb-3 opacity-30" />
            <p>Pronto habrá artículos disponibles</p>
          </div>
        )}

        {featured.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/catalogo" className="btn-primary px-8 py-3.5 text-base">
              Ver catálogo completo ({products.length} artículos) <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>

      {/* ── Delivery ── */}
      <DeliveryInfo />

      {/* ── Social proof / funnel ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">📱 Sígueme</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Encuéntrame también en</h2>
          <p className="text-gray-500 mb-8">Publica tus preguntas, mira videos de los artículos y más novedades</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE_CONFIG.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#1877F2] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#166fe5] transition-colors active:scale-95"
            >
              <Facebook size={20} /> Facebook Marketplace
            </a>
            <a
              href={SITE_CONFIG.socialMedia.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#010101] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors active:scale-95"
            >
              <Music2 size={20} /> TikTok
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">¿Cómo comprar?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { step: '1', icon: '👀', title: 'Explora el catálogo', desc: 'Navega todos los artículos disponibles y encuentra lo que necesitas.' },
            { step: '2', icon: '💬', title: 'Escríbeme al WhatsApp', desc: 'Haz clic en "Lo quiero" y te conecto directamente al chat.' },
            { step: '3', icon: '🤝', title: 'Coordinamos la entrega', desc: 'Acordamos el punto de entrega o el envío nacional que más te convenga.' },
          ].map(s => (
            <div key={s.step} className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-card">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-2xl">{s.icon}</div>
              <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Paso {s.step}</span>
              <h3 className="font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
