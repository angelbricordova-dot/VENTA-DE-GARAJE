import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Tag, Menu, X, ShoppingBag, Moon, Sun } from 'lucide-react'
import { SITE_CONFIG } from '../config'
import { useTheme } from '../context/ThemeContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { dark, toggle } = useTheme()

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/envios', label: 'Envíos' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm dark:bg-gray-900/90 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-gray-100 hover:text-brand-600 transition-colors">
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
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
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
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Menú"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
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
