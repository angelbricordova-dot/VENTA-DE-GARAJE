export const SITE_CONFIG = {
  name: 'Venta de Garaje',
  tagline: '¡Grandes ofertas esperan por ti!',
  description: 'Artículos usados en excelente estado, a precios increíbles.',
  // Cambia este número en Netlify > Environment variables: VITE_WHATSAPP_NUMBER
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '584XXXXXXXXX',
  socialMedia: {
    facebook: 'https://www.facebook.com/marketplace',
    tiktok: 'https://www.tiktok.com',
  },
  delivery: [
    {
      city: 'Maracay',
      icon: '📍',
      schedule: 'Todos los días de semana',
      note: 'Lunes a Viernes',
      color: 'emerald',
    },
    {
      city: 'Caracas',
      icon: '🏙️',
      schedule: 'Todos los días de semana',
      note: 'Lunes a Viernes',
      color: 'blue',
    },
    {
      city: 'Valencia',
      icon: '🗺️',
      schedule: 'Solo fines de semana',
      note: 'Sábados y Domingos',
      color: 'purple',
    },
    {
      city: 'Nacional',
      icon: '📦',
      schedule: 'MRW o Zoom',
      note: 'Cobro a destino',
      color: 'amber',
    },
  ],
}

export const ADMIN_PASSWORD_KEY = 'vg_admin_pwd'
export const PRODUCTS_KEY = 'vg_products'
export const SETTINGS_KEY = 'vg_settings'
export const DEFAULT_ADMIN_PASSWORD = 'garaje2024'

export const CATEGORIES = [
  'Electrónicos',
  'Ropa',
  'Calzado',
  'Hogar',
  'Muebles',
  'Libros',
  'Juguetes',
  'Deportes',
  'Belleza',
  'Bebé',
  'Vehículos',
  'Otros',
]

export const CONDITIONS = [
  'Como nuevo',
  'Buen estado',
  'Estado regular',
  'Para reparar',
]

export const STATUS_LABELS = {
  available: { label: 'Disponible', color: 'available' },
  pending:   { label: 'Apartado',   color: 'pending'   },
  sold:      { label: 'Vendido',    color: 'sold'      },
}
