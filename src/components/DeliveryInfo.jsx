import { SITE_CONFIG } from '../config'
import { MapPin, Package, Clock } from 'lucide-react'

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  blue:    'bg-blue-50   text-blue-800   border-blue-100',
  purple:  'bg-purple-50 text-purple-800 border-purple-100',
  amber:   'bg-amber-50  text-amber-800  border-amber-100',
}

const iconColorMap = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue:    'bg-blue-100   text-blue-600',
  purple:  'bg-purple-100 text-purple-600',
  amber:   'bg-amber-100  text-amber-600',
}

export default function DeliveryInfo({ compact = false }) {
  return (
    <section className={compact ? '' : 'py-16 bg-white'}>
      <div className={compact ? '' : 'max-w-6xl mx-auto px-4 sm:px-6'}>
        {!compact && (
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">📦 Entregas</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">¿Dónde hacemos entregas?</h2>
            <p className="text-gray-500 mt-2">Entrega personal en estas ciudades, o envío nacional</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITE_CONFIG.delivery.map((d) => (
            <div
              key={d.city}
              className={`rounded-2xl border p-5 flex flex-col gap-3 ${colorMap[d.color]}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${iconColorMap[d.color]}`}>
                {d.icon}
              </div>
              <div>
                <h3 className="font-bold text-base">{d.city}</h3>
                <p className="text-sm font-medium mt-0.5 opacity-80">{d.schedule}</p>
                <p className="text-xs mt-1 opacity-60">{d.note}</p>
              </div>
            </div>
          ))}
        </div>

        {!compact && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 bg-gray-50 rounded-2xl p-5 text-sm text-gray-600">
            <div className="flex items-start gap-2 flex-1">
              <Package size={16} className="mt-0.5 text-brand-500 shrink-0" />
              <span><strong className="text-gray-800">Envíos nacionales:</strong> Trabajamos con MRW y Zoom Express con cobro a destino. El costo corre por cuenta del comprador.</span>
            </div>
            <div className="flex items-start gap-2 flex-1">
              <Clock size={16} className="mt-0.5 text-brand-500 shrink-0" />
              <span><strong className="text-gray-800">Coordinar entrega:</strong> Escríbeme por WhatsApp y acordamos el punto de encuentro más conveniente para ambos.</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
