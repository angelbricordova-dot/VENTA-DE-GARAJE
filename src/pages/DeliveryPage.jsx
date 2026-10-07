import { Link } from 'react-router-dom'
import DeliveryInfo from '../components/DeliveryInfo'
import { MessageCircle } from 'lucide-react'
import { useSettings } from '../hooks/useAdmin'
import { SITE_CONFIG } from '../config'

export default function DeliveryPage() {
  const { settings } = useSettings()
  const phone = settings.whatsapp || SITE_CONFIG.whatsappNumber

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Información de Envíos y Entregas</h1>
        <p className="text-gray-500 mt-1">Todo lo que necesitas saber sobre cómo recibir tu artículo</p>
      </div>

      <DeliveryInfo />

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {[
            {
              q: '¿Cómo coordino la entrega?',
              a: 'Una vez que acuerdes la compra por WhatsApp, coordinamos el punto de encuentro más conveniente para los dos. Normalmente en lugares públicos y seguros.',
            },
            {
              q: '¿Cuánto cuesta el envío nacional?',
              a: 'El envío va a cobro a destino, así que lo pagas cuando recibes el paquete. Trabajamos con MRW y Zoom Express. El costo varía según el peso y la distancia.',
            },
            {
              q: '¿Puedo pagar en bolívares?',
              a: 'Sí, los precios en USD son referenciales. Podemos acordar el pago en bolívares a la tasa del día o en USDT. Escríbeme y lo conversamos.',
            },
            {
              q: '¿Los artículos tienen garantía?',
              a: 'Son artículos usados, así que no tienen garantía formal. Siempre soy transparente sobre el estado real de cada artículo en la descripción. Puedes verlos en persona antes de pagar.',
            },
            {
              q: '¿Puedo apartar un artículo?',
              a: 'Sí. Con un pequeño adelanto (acordado por WhatsApp) puedo apartarlo hasta que coordines la entrega.',
            },
          ].map(faq => (
            <details key={faq.q} className="bg-white rounded-2xl shadow-card group">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-800 select-none">
                {faq.q}
                <span className="text-brand-500 group-open:rotate-180 transition-transform duration-200">▼</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center bg-brand-50 rounded-3xl p-8">
        <div className="text-4xl mb-3">💬</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes más preguntas?</h3>
        <p className="text-gray-500 mb-6">Escríbeme directamente y te respondo rápido</p>
        <a
          href={`https://wa.me/${phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp inline-flex px-8 py-3.5 text-base"
        >
          <MessageCircle size={20} /> Escribir al WhatsApp
        </a>
      </div>
    </main>
  )
}
