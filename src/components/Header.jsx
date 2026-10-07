import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Tag, Menu, X, ShoppingBag } from 'lucide-react'
import { SITE_CONFIG } from '../config'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/envios', label: 'Envíos' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-gray-900 hover:text-brand-600 transition-colors">
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white">
            <Tag size={18} />
          </div>
          <span className="text-base leading-tight">
            Venta de <br className="hidden sm:block" />
            <span className="text-brand-500">Garaje</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + Burger */}
        <div className="flex items-center gap-3">
          <Link to="/catalogo" className="btn-primary hidden sm:inline-flex">
            <ShoppingBag size={16} />
            Ver catálogo
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/catalogo"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2"
          >
            <ShoppingBag size={16} />
            Ver catálogo completo
          </Link>
        </div>
      )}
    </header>
  )
}
