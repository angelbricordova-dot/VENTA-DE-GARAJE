import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Pencil, Trash2, LogOut, Tag, Package, CheckCircle, Clock,
  Save, X, Settings, ChevronDown, ArrowLeft, Eye, Download, Upload, RotateCcw
} from 'lucide-react'
import { useAdmin, useSettings } from '../hooks/useAdmin'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES, CONDITIONS, STATUS_LABELS, DEFAULT_ADMIN_PASSWORD } from '../config'
import StatusBadge from '../components/StatusBadge'

// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const { login } = useAdmin()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(pwd)) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className={`bg-white rounded-3xl shadow-card-hover p-8 w-full max-w-sm ${shake ? 'animate-shake' : ''}`}
        style={shake ? { animation: 'shake 0.4s ease' } : {}}>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Panel Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Venta de Garaje</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Contraseña</label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false) }}
              className={`input ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
              placeholder="Contraseña del admin"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-1.5">Contraseña incorrecta</p>}
          </div>
          <button type="submit" className="btn-primary w-full py-3.5">
            Entrar al panel
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          Contraseña por defecto: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{DEFAULT_ADMIN_PASSWORD}</code>
        </p>
      </div>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-8px)}
          80%{transform:translateX(8px)}
        }
      `}</style>
    </main>
  )
}

// ─── Product Form ─────────────────────────────────────────────────────────────
const emptyForm = {
  title: '', description: '', price: '', originalPrice: '', currency: 'USD',
  status: 'available', imageUrl: '', category: '', condition: 'Buen estado',
}

function ProductForm({ initial = emptyForm, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) return
    onSave({ ...form, price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="label">Título del artículo *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="ej. iPhone 11 Pro 256GB Negro" required />
          </div>
          {/* Description */}
          <div className="sm:col-span-2">
            <label className="label">Descripción</label>
            <textarea
              className="input resize-none h-28"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe el estado, lo que incluye, tamaño, color..."
            />
          </div>
          {/* Image URL */}
          <div className="sm:col-span-2">
            <label className="label">URL de la imagen</label>
            <input className="input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
            <p className="text-xs text-gray-400 mt-1">Pega el enlace de cualquier imagen online (Google Drive, Imgur, Unsplash, etc.)</p>
          </div>
          {/* Preview image */}
          {form.imageUrl && (
            <div className="sm:col-span-2">
              <img src={form.imageUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover border" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {/* Price */}
          <div>
            <label className="label">Precio *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input className="input pl-7" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
            </div>
          </div>
          {/* Original price */}
          <div>
            <label className="label">Precio original (opcional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input className="input pl-7" type="number" min="0" step="0.01" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="label">Categoría</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Sin categoría</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Condition */}
          <div>
            <label className="label">Estado del artículo</label>
            <select className="input" value={form.condition} onChange={e => set('condition', e.target.value)}>
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Status */}
          <div className="sm:col-span-2">
            <label className="label">Estado de venta</label>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('status', key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.status === key
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          {/* Buttons */}
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1 py-3.5">
              <Save size={16} /> Guardar artículo
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ onClose }) {
  const { settings, saveSettings } = useSettings()
  const { changePassword } = useAdmin()
  const { products, resetToSeed } = useProducts()
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '')
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState('')
  const [savedWa, setSavedWa] = useState(false)

  const handleSaveWa = () => { saveSettings({ whatsapp }); setSavedWa(true); setTimeout(() => setSavedWa(false), 2000) }

  const handleChangePwd = () => {
    if (pwdForm.next !== pwdForm.confirm) { setPwdMsg('Las contraseñas no coinciden'); return }
    if (pwdForm.next.length < 6) { setPwdMsg('Mínimo 6 caracteres'); return }
    if (changePassword(pwdForm.current, pwdForm.next)) {
      setPwdMsg('✅ Contraseña actualizada')
      setPwdForm({ current: '', next: '', confirm: '' })
    } else {
      setPwdMsg('Contraseña actual incorrecta')
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'productos-garaje.json'
    a.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-bold text-gray-900">Configuración</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-7">
          {/* WhatsApp */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">📱 Número de WhatsApp</h3>
            <input
              className="input"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="584121234567 (sin + ni espacios)"
            />
            <p className="text-xs text-gray-400 mt-1.5">Formato: código país + número. Ej: 584121234567</p>
            <button onClick={handleSaveWa} className="btn-primary mt-3 w-full">
              {savedWa ? '✅ Guardado' : <><Save size={15}/> Guardar número</>}
            </button>
          </div>

          {/* Change password */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🔒 Cambiar contraseña</h3>
            <div className="flex flex-col gap-3">
              <input className="input" type="password" placeholder="Contraseña actual" value={pwdForm.current} onChange={e => setPwdForm(f => ({...f, current: e.target.value}))} />
              <input className="input" type="password" placeholder="Nueva contraseña" value={pwdForm.next} onChange={e => setPwdForm(f => ({...f, next: e.target.value}))} />
              <input className="input" type="password" placeholder="Confirmar nueva contraseña" value={pwdForm.confirm} onChange={e => setPwdForm(f => ({...f, confirm: e.target.value}))} />
              {pwdMsg && <p className={`text-xs ${pwdMsg.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{pwdMsg}</p>}
              <button onClick={handleChangePwd} className="btn-secondary w-full">Cambiar contraseña</button>
            </div>
          </div>

          {/* Export/Import */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">📁 Datos</h3>
            <div className="flex flex-col gap-2">
              <button onClick={handleExport} className="btn-secondary w-full">
                <Download size={15} /> Exportar productos (JSON)
              </button>
              <button
                onClick={() => { if (confirm('¿Resetear a los productos de ejemplo? Perderás todos los cambios.')) resetToSeed() }}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <RotateCcw size={15} /> Restaurar datos de ejemplo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function Admin() {
  const { isAuthenticated, logout } = useAdmin()
  const [authed, setAuthed] = useState(isAuthenticated)
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  const filtered = statusFilter === 'all' ? products : products.filter(p => p.status === statusFilter)
  const counts = {
    all:       products.length,
    available: products.filter(p => p.status === 'available').length,
    pending:   products.filter(p => p.status === 'pending').length,
    sold:      products.filter(p => p.status === 'sold').length,
  }

  const handleSaveNew = (data) => { addProduct(data); setShowForm(false) }
  const handleSaveEdit = (data) => { updateProduct(editProduct.id, data); setEditProduct(null) }
  const handleDelete = (id) => { deleteProduct(id); setDeleteConfirm(null) }
  const quickStatus = (id, status) => updateProduct(id, { status })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors">
              <ArrowLeft size={15} /> Ir al sitio
            </Link>
            <span className="text-gray-200">|</span>
            <span className="font-bold text-gray-800 text-sm">Panel Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSettings(true)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
              <Settings size={18} />
            </button>
            <button onClick={() => { logout(); setAuthed(false) }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total artículos', value: counts.all, icon: <Package size={20} />, color: 'bg-gray-100 text-gray-700' },
            { label: 'Disponibles', value: counts.available, icon: <CheckCircle size={20} />, color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Apartados', value: counts.pending, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-700' },
            { label: 'Vendidos', value: counts.sold, icon: <Tag size={20} />, color: 'bg-red-50 text-red-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.color} flex items-center gap-4`}>
              <div className="opacity-70">{s.icon}</div>
              <div>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs opacity-70 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header + Add button */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2 flex-wrap">
            {['all', 'available', 'pending', 'sold'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {s === 'all' ? 'Todos' : STATUS_LABELS[s]?.label} ({counts[s]})
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} /> Nuevo artículo
          </button>
        </div>

        {/* Product list */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No hay artículos en esta categoría</p>
              <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
                <Plus size={15} /> Agregar artículo
              </button>
            </div>
          )}
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4 items-start">
              {/* Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                  : <div className="product-image-placeholder w-full h-full flex items-center justify-center text-xl">🏷️</div>
                }
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 text-sm leading-tight flex-1 min-w-0 truncate">{product.title}</p>
                  <StatusBadge status={product.status} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{product.category} · {product.condition}</p>
                <p className="text-base font-bold text-gray-900 mt-1">
                  ${product.price} <span className="text-xs text-gray-400 font-normal">{product.currency}</span>
                  {product.originalPrice && <span className="text-xs text-gray-400 line-through ml-1">${product.originalPrice}</span>}
                </p>
                {/* Quick status change */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {['available', 'pending', 'sold'].map(s => (
                    <button
                      key={s}
                      disabled={product.status === s}
                      onClick={() => quickStatus(product.id, s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                        product.status === s
                          ? 'bg-gray-100 text-gray-400 border-transparent cursor-default'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      → {STATUS_LABELS[s]?.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Link
                  to={`/producto/${product.id}`}
                  target="_blank"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  title="Ver en sitio"
                >
                  <Eye size={17} />
                </Link>
                <button
                  onClick={() => setEditProduct(product)}
                  className="p-2 rounded-xl hover:bg-brand-50 transition-colors text-gray-400 hover:text-brand-600"
                  title="Editar"
                >
                  <Pencil size={17} />
                </button>
                <button
                  onClick={() => setDeleteConfirm(product)}
                  className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ProductForm title="Nuevo artículo" onSave={handleSaveNew} onCancel={() => setShowForm(false)} />
      )}
      {editProduct && (
        <ProductForm
          title="Editar artículo"
          initial={{ ...editProduct, price: String(editProduct.price), originalPrice: editProduct.originalPrice ? String(editProduct.originalPrice) : '' }}
          onSave={handleSaveEdit}
          onCancel={() => setEditProduct(null)}
        />
      )}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-bold text-gray-900">¿Eliminar artículo?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteConfirm.title}"</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
                Eliminar
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
