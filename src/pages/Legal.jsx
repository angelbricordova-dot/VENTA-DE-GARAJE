import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { FileText, Shield, Cookie, ScrollText } from 'lucide-react'

const LAST_UPDATED = '7 de octubre de 2025'
const SITE_URL = 'https://ventadegaraje.netlify.app'
const OWNER_EMAIL = 'angelbricordova@gmail.com'

const NAV = [
  { to: '/legal/aviso',     label: 'Aviso Legal',          icon: <FileText  size={16} /> },
  { to: '/legal/privacidad',label: 'Política de Privacidad',icon: <Shield    size={16} /> },
  { to: '/legal/cookies',   label: 'Política de Cookies',  icon: <Cookie    size={16} /> },
  { to: '/legal/terminos',  label: 'Términos y Condiciones',icon: <ScrollText size={16} /> },
]

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-sm text-gray-600 space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

// ── Aviso Legal ───────────────────────────────────────────────────────────────
function AvisoLegal() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Aviso Legal</h1>
        <p className="text-sm text-gray-400 mt-1">Última actualización: {LAST_UPDATED}</p>
      </header>
      <Section title="1. Identificación del titular">
        <p>En cumplimiento de la normativa vigente, se informa que el titular y responsable de este sitio web es:</p>
        <ul className="list-none space-y-1 mt-2 pl-0">
          <li><strong>Nombre:</strong> Ángel Bricordova</li>
          <li><strong>Actividad:</strong> Venta de artículos de segunda mano (uso particular, no comercial habitual)</li>
          <li><strong>Correo electrónico:</strong> <a href={`mailto:${OWNER_EMAIL}`} className="text-brand-600 hover:underline">{OWNER_EMAIL}</a></li>
          <li><strong>Ubicación:</strong> Maracay, Venezuela</li>
          <li><strong>WhatsApp:</strong> Disponible en la página</li>
        </ul>
      </Section>
      <Section title="2. Objeto y ámbito">
        <p>Este sitio web tiene como objeto publicar un catálogo de artículos de segunda mano de uso propio para su venta directa entre particulares. No constituye una actividad comercial habitual ni una empresa.</p>
      </Section>
      <Section title="3. Propiedad intelectual">
        <p>Los textos, diseño e imágenes propias de este sitio son propiedad del titular. Las imágenes de productos son de uso propio o provienen de servicios de imágenes con licencia libre (Unsplash). Queda prohibida su reproducción sin autorización.</p>
      </Section>
      <Section title="4. Responsabilidad">
        <p>El titular no garantiza la disponibilidad, continuidad o infalibilidad del funcionamiento del sitio. Los artículos publicados son de segunda mano; su estado se describe de buena fe pero no se otorga garantía formal de ningún tipo. La descripción de cada producto es orientativa.</p>
      </Section>
      <Section title="5. Legislación aplicable">
        <p>Este sitio web se rige por la legislación venezolana vigente, incluyendo la <em>Ley Orgánica de Protección de Datos Personales (LOPDP)</em> y demás normativas aplicables a transacciones entre particulares en Venezuela.</p>
      </Section>
    </>
  )
}

// ── Política de Privacidad ────────────────────────────────────────────────────
function Privacidad() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mt-1">Última actualización: {LAST_UPDATED}</p>
      </header>
      <Section title="1. Responsable del tratamiento">
        <p>El responsable del tratamiento de sus datos personales es Ángel Bricordova, contactable en <a href={`mailto:${OWNER_EMAIL}`} className="text-brand-600 hover:underline">{OWNER_EMAIL}</a>.</p>
      </Section>
      <Section title="2. Datos que se recopilan">
        <p>Este sitio web <strong>no recopila ni almacena datos personales en servidores</strong>. La única interacción que implica datos personales es:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li><strong>WhatsApp:</strong> Al hacer clic en el botón "Lo quiero", usted es redirigido a la aplicación WhatsApp de su dispositivo. El mensaje se envía desde su cuenta personal directamente al vendedor. Este sitio web no intercepta, almacena ni procesa esa comunicación.</li>
          <li><strong>Preferencias locales:</strong> El panel de administración almacena datos exclusivamente en el almacenamiento local (<em>localStorage</em>) de su navegador. Estos datos nunca se transmiten a ningún servidor.</li>
        </ul>
      </Section>
      <Section title="3. Finalidad del tratamiento">
        <p>Dado que no se recopilan datos personales en servidores, no existe finalidad de tratamiento más allá de la funcionalidad técnica local descrita.</p>
      </Section>
      <Section title="4. Comunicaciones por WhatsApp">
        <p>Cuando usted inicia un chat de WhatsApp a través de este sitio, esa comunicación se rige por la <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Política de Privacidad de WhatsApp/Meta</a>. El vendedor gestionará su número y mensajes de forma confidencial, únicamente para gestionar la transacción.</p>
      </Section>
      <Section title="5. Derechos del usuario (ARCO)">
        <p>Puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición contactando directamente al titular por correo electrónico. Al no existir base de datos en servidor, el ejercicio principal de estos derechos es borrar el historial de conversación de WhatsApp y el almacenamiento local de su navegador.</p>
      </Section>
      <Section title="6. Proveedores de servicios tecnológicos">
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Netlify Inc.</strong> (alojamiento web): puede tener acceso a logs de acceso que incluyen su dirección IP. Consulte su <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">política de privacidad</a>.</li>
          <li><strong>Unsplash (imágenes de ejemplo):</strong> las imágenes de muestra del catálogo se cargan desde sus servidores. Consulte su política de privacidad en unsplash.com.</li>
        </ul>
      </Section>
      <Section title="7. Cambios en esta política">
        <p>El titular se reserva el derecho de modificar esta política. Los cambios se indicarán con una nueva fecha de actualización en este documento.</p>
      </Section>
    </>
  )
}

// ── Política de Cookies ───────────────────────────────────────────────────────
function Cookies() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Política de Cookies</h1>
        <p className="text-sm text-gray-400 mt-1">Última actualización: {LAST_UPDATED}</p>
      </header>
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-sm text-emerald-800">
        <strong>Resumen:</strong> Este sitio web <strong>no utiliza cookies de rastreo, publicidad ni analíticas</strong>. Solo almacena datos funcionales en su dispositivo mediante <em>localStorage</em>.
      </div>
      <Section title="1. ¿Qué son las cookies?">
        <p>Las cookies son pequeños archivos de texto almacenados en su dispositivo por un sitio web. Pueden usarse para funcionalidad técnica, recordar preferencias o rastrear su actividad.</p>
      </Section>
      <Section title="2. Cookies utilizadas por este sitio">
        <p>Este sitio web <strong>no instala ninguna cookie</strong> en su navegador. En su lugar, utiliza exclusivamente <strong>localStorage</strong> del navegador (almacenamiento local) para:</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 font-semibold border border-gray-200">Clave</th>
                <th className="text-left p-2 font-semibold border border-gray-200">Propósito</th>
                <th className="text-left p-2 font-semibold border border-gray-200">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['vg_products', 'Catálogo de productos (solo admin)', 'Funcional'],
                ['vg_settings', 'Número de WhatsApp configurado (solo admin)', 'Funcional'],
                ['vg_admin_pwd', 'Contraseña del panel admin (solo admin)', 'Funcional'],
              ].map(([k, p, t]) => (
                <tr key={k} className="border-b border-gray-100">
                  <td className="p-2 border border-gray-200 font-mono text-xs">{k}</td>
                  <td className="p-2 border border-gray-200">{p}</td>
                  <td className="p-2 border border-gray-200 text-emerald-700 font-medium">{t}</td>
                </tr>
              ))}
              <tr>
                <td className="p-2 border border-gray-200 font-mono text-xs">vg_admin_auth</td>
                <td className="p-2 border border-gray-200">Sesión activa en el panel admin (sessionStorage, se borra al cerrar pestaña)</td>
                <td className="p-2 border border-gray-200 text-emerald-700 font-medium">Funcional</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">Estos datos nunca se transmiten a ningún servidor y solo están accesibles desde su propio navegador.</p>
      </Section>
      <Section title="3. Cookies de terceros">
        <p>Las imágenes de ejemplo del catálogo se cargan desde <strong>Unsplash</strong>. Al cargarlas, su navegador puede enviarles su dirección IP. Cuando las imágenes sean reemplazadas por las del propio vendedor, este acceso desaparecerá.</p>
        <p className="mt-2">No se utilizan herramientas de analíticas (Google Analytics, etc.), publicidad ni redes sociales integradas directamente en el sitio.</p>
      </Section>
      <Section title="4. Cómo gestionar el almacenamiento local">
        <p>Puede borrar los datos almacenados localmente en cualquier momento desde la configuración de su navegador:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Chrome/Edge: Configuración → Privacidad y seguridad → Borrar datos de navegación</li>
          <li>Firefox: Ajustes → Privacidad y seguridad → Limpiar datos</li>
          <li>Safari: Configuración → Safari → Borrar historial y datos de sitios web</li>
        </ul>
      </Section>
    </>
  )
}

// ── Términos y Condiciones ────────────────────────────────────────────────────
function Terminos() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Términos y Condiciones</h1>
        <p className="text-sm text-gray-400 mt-1">Última actualización: {LAST_UPDATED}</p>
      </header>
      <Section title="1. Aceptación de los términos">
        <p>El acceso y uso de este sitio web implica la aceptación de los presentes términos. Si no está de acuerdo, le rogamos que no utilice este servicio.</p>
      </Section>
      <Section title="2. Naturaleza de la venta">
        <p>Este sitio es un catálogo personal de artículos de segunda mano. No constituye una tienda online ni una actividad comercial habitual. Las ventas son acuerdos directos entre particulares, sin intermediarios.</p>
      </Section>
      <Section title="3. Proceso de compra">
        <ul className="list-disc pl-5 space-y-1">
          <li>El usuario selecciona un artículo y contacta al vendedor a través de WhatsApp.</li>
          <li>Las condiciones finales (precio, forma de pago y entrega) se acuerdan directamente por WhatsApp.</li>
          <li>El vendedor no está obligado a vender a quien no desee y puede rechazar una venta sin justificación.</li>
          <li>Un artículo marcado como "Disponible" no garantiza su reserva hasta que se acuerde explícitamente por escrito (WhatsApp).</li>
        </ul>
      </Section>
      <Section title="4. Precios y formas de pago">
        <p>Los precios se expresan en dólares estadounidenses (USD) como referencia. El pago puede acordarse en USD, Bs.D (bolívares digitales) a tasa del día, o USDT. El método de pago se define al momento de la negociación.</p>
      </Section>
      <Section title="5. Entregas y envíos">
        <p>Se realizan entregas personales en Maracay (lunes a viernes), Caracas (lunes a viernes) y Valencia (sábados y domingos). Los envíos nacionales se realizan a través de MRW o Zoom Express con cobro a destino. El costo del envío es responsabilidad del comprador.</p>
      </Section>
      <Section title="6. Estado de los artículos y garantías">
        <p>Todos los artículos son de segunda mano. El estado de cada artículo se describe de la manera más precisa y honesta posible. <strong>No se otorga ninguna garantía formal.</strong> El comprador acepta el artículo en el estado descrito. Se recomienda verificar el artículo antes de pagar cuando sea posible.</p>
      </Section>
      <Section title="7. Devoluciones">
        <p>Dado que son ventas entre particulares, no existe obligación legal de aceptar devoluciones. Sin embargo, en caso de que un artículo no coincida con la descripción publicada, el vendedor se compromete a negociar una solución de buena fe.</p>
      </Section>
      <Section title="8. Uso de Inteligencia Artificial">
        <p>Este sitio web <strong>no ofrece servicios de Inteligencia Artificial</strong> al usuario. El sitio fue construido con asistencia de herramientas de IA generativa (Claude de Anthropic), pero estas herramientas no están expuestas al público ni procesan datos de los usuarios. Los textos, precios y descripciones de productos son creados por el titular humano del sitio.</p>
      </Section>
      <Section title="9. Limitación de responsabilidad">
        <p>El titular no será responsable de ningún daño directo o indirecto derivado del uso o la imposibilidad de uso de este sitio, ni de las comunicaciones realizadas a través de terceros (WhatsApp, MRW, Zoom).</p>
      </Section>
      <Section title="10. Modificaciones">
        <p>El titular se reserva el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta misma página con nueva fecha de actualización.</p>
      </Section>
      <Section title="11. Contacto">
        <p>Para cualquier consulta sobre estos términos, puede contactar al titular en: <a href={`mailto:${OWNER_EMAIL}`} className="text-brand-600 hover:underline">{OWNER_EMAIL}</a></p>
      </Section>
    </>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export default function Legal() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar nav */}
        <aside className="lg:w-56 shrink-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3">Documentos legales</p>
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {n.icon} {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 min-w-0 bg-white rounded-3xl shadow-card p-6 sm:p-8">
          <Routes>
            <Route path="aviso"      element={<AvisoLegal />} />
            <Route path="privacidad" element={<Privacidad />} />
            <Route path="cookies"    element={<Cookies />} />
            <Route path="terminos"   element={<Terminos />} />
            <Route path="*"          element={<Navigate to="aviso" replace />} />
          </Routes>
        </article>
      </div>
    </main>
  )
}
