import { Link } from 'react-router-dom'
import { Tag, Facebook, Music2, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '../config'
import { useSettings } from '../hooks/useAdmin'

export default function Footer() {
  const { settings } = useSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white">
              <Tag size={18} />
            </div>
            <span className="text-white font-bold text-lg">Venta de Garaje</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Artículos usados en excelente estado, a precios increíbles. ¡Tu próxima joya te espera aquí!
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href={SITE_CONFIG.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Facebook size={17} />
            </a>
            <a
              href={SITE_CONFIG.socialMedia.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Music2 size={17} />
            </a>
            <a
              href={`https://wa.me/${(settings.whatsapp || SITE_CONFIG.whatsappNumber).replace(/\D/g,'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-[#25D366]/20 flex items-center justify-center hover:bg-[#25D366]/30 transition-colors text-[#25D366]"
            >
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Navegación</h4>
          <ul className="space-y-2.5 text-sm">
            {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/envios', 'Info de Envíos']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery summary */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Entregas</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>📍 <strong className="text-gray-200">Maracay</strong> — Lun a Vie</li>
            <li>🏙️ <strong className="text-gray-200">Caracas</strong> — Lun a Vie</li>
            <li>🗺️ <strong className="text-gray-200">Valencia</strong> — Sáb y Dom</li>
            <li>📦 <strong className="text-gray-200">Nacional</strong> — MRW / Zoom (cobro a destino)</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center text-xs text-gray-500 py-4 px-4">
        © {year} Venta de Garaje · Hecho con ❤️ en Venezuela
        <span className="mx-3">·</span>
        <Link to="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>
      </div>
    </footer>
  )
}
