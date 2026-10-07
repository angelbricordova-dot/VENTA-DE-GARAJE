import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 select-none" role="img" aria-label="Linterna">🔦</div>
      <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wider uppercase">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
        ¡Esa ganga no existe!
      </h1>
      <p className="text-gray-500 mb-2 max-w-sm">
        La página que buscas no se encontró. Quizás ya fue vendida o el enlace está incorrecto.
      </p>
      <p className="text-gray-400 text-sm mb-10">😄 Pero hay muchas otras ofertas esperándote...</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/catalogo" className="btn-primary px-8 py-3.5">
          Ver catálogo disponible
        </Link>
        <Link to="/" className="btn-secondary">
          Ir al inicio
        </Link>
      </div>
    </main>
  )
}
