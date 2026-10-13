import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Pencil, Trash2, LogOut, Tag, Package, CheckCircle, Clock,
  Save, X, Settings, ChevronDown, ArrowLeft, Eye, Download, Upload,
  RotateCcw, Search, ToggleLeft, ToggleRight, ShoppingBag
} from 'lucide-react'
import { useAdmin, useSettings } from '../hooks/useAdmin'
import { useProducts } from '../hooks/useProducts'
import { useBundles } from '../hooks/useBundles'
import { CATEGORIES, CONDITIONS, STATUS_LABELS, CLOTHING_SIZES, SHOE_SIZES } from '../config'
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

// ─── Image Upload Helper ──────────────────────────────────────────────────────
function compressImage(file, maxPx = 800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = reject
      img.src = ev.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Product Form ─────────────────────────────────────────────────────────────
const emptyForm = {
  title: '', description: '', price: '', originalPrice: '', currency: 'USD',
  status: 'available', imageUrl: '', images: [], category: '', condition: 'Buen estado',
  negotiable: false, stock: '', size: '',
}

function ProductForm({ initial = emptyForm, onSave, onCancel, title }) {
  const [form, setForm] = useState(() => {
    const f = { ...initial }
    if (!f.images || f.images.length === 0) f.images = f.imageUrl ? [f.imageUrl] : []
    return f
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const images = form.images || []
  const setImages = (imgs) => setForm(f => ({ ...f, images: imgs, imageUrl: imgs[0] || '' }))
  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx))

  const handleFiles = async (files) => {
    if (!files?.length) return
    const remaining = 8 - images.length
    if (remaining <= 0) return
    setUploading(true)
    setUploadError('')
    try {
      const toProcess = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith('image/'))
      if (!toProcess.length) { setUploadError('Solo se aceptan imágenes'); setUploading(false); return }
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)))
      setImages([...images, ...compressed])
    } catch {
      setUploadError('Error al procesar alguna imagen')
    } finally {
      setUploading(false)
    }
  }

  const addByUrl = () => {
    const url = urlInput.trim()
    if (!url || images.length >= 8) return
    setImages([...images, url])
    setUrlInput('')
  }

  const buildPayload = (overrides = {}) => ({
    ...form,
    ...overrides,
    price: Number(form.price) || 0,
    originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) return
    onSave(buildPayload())
  }

  const handleSaveDraft = () => {
    if (!form.title.trim()) return
    onSave(buildPayload({ status: 'draft' }))
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
          {/* Images — multi */}
          <div className="sm:col-span-2">
            <label className="label">
              Fotos del artículo
              <span className="text-gray-400 font-normal ml-1">({images.length}/8)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20 shrink-0">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" onError={e => e.target.style.opacity='0.3'} />
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] bg-brand-500 text-white px-1.5 py-0.5 rounded-full whitespace-nowrap leading-tight">Portada</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {images.length < 8 && (
                <label
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all shrink-0"
                  onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                  onDragOver={e => e.preventDefault()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFiles(e.target.files)}
                  />
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={20} className="text-gray-300" />
                      <span className="text-[10px] text-gray-400 mt-0.5">Foto</span>
                    </>
                  )}
                </label>
              )}
            </div>
            {uploadError && <p className="text-xs text-red-500 mb-2">{uploadError}</p>}
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="O añade por URL: https://..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addByUrl() } }}
              />
              <button type="button" onClick={addByUrl} disabled={!urlInput.trim() || images.length >= 8} className="btn-secondary px-3 py-2 text-xs disabled:opacity-40">
                Añadir
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">La primera foto es la portada · puedes seleccionar varias a la vez</p>
          </div>
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
          {/* Stock */}
          <div>
            <label className="label">Unidades disponibles</label>
            <input
              className="input"
              type="number"
              min="1"
              step="1"
              value={form.stock}
              onChange={e => set('stock', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="ej. 3"
            />
            <p className="text-xs text-gray-400 mt-1">Deja vacío para no mostrarlo</p>
          </div>
          {/* Negotiable */}
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!form.negotiable}
                onChange={e => set('negotiable', e.target.checked)}
                className="w-4 h-4 rounded accent-brand-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Precio negociable</span>
                <p className="text-xs text-gray-400">Se mostrará en la publicación</p>
              </div>
            </label>
          </div>
          {/* Category */}
          <div>
            <label className="label">Categoría</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Sin categoría</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {/* Size — Ropa / Calzado */}
          {(form.category === 'Ropa' || form.category === 'Calzado') && (
            <div className="sm:col-span-2">
              <label className="label">Talla</label>
              <div className="flex gap-2 flex-wrap">
                {(form.category === 'Calzado' ? SHOE_SIZES : CLOTHING_SIZES).map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => set('size', form.size === sz ? '' : sz)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                      form.size === sz
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              {Object.entries(STATUS_LABELS).filter(([k]) => k !== 'draft').map(([key, cfg]) => (
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
          <div className="sm:col-span-2 flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1 py-3.5">
                <Save size={16} /> {form.status === 'draft' ? 'Publicar artículo' : 'Guardar artículo'}
              </button>
              <button type="button" onClick={onCancel} className="btn-secondary">
                Cancelar
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors w-full"
            >
              <span className="text-base">📝</span> Guardar como borrador
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Bundle Form ──────────────────────────────────────────────────────────────
const emptyBundle = {
  title: '', description: '', price: '', currency: 'USD', productIds: [], status: 'active',
}

function BundleForm({ initial = emptyBundle, products, onSave, onCancel, title }) {
  const [form, setForm] = useState({ ...initial, price: initial.price ? String(initial.price) : '' })
  const [search, setSearch] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const availableProducts = products.filter(p => p.status === 'available')
  const filteredProducts = search
    ? availableProducts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    : availableProducts

  const toggleProduct = (id) => {
    const ids = form.productIds.includes(id)
      ? form.productIds.filter(x => x !== id)
      : [...form.productIds, id]
    set('productIds', ids)
  }

  const selectedProducts = form.productIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  const originalTotal = selectedProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
  const savings = form.price && originalTotal > Number(form.price)
    ? Math.round((1 - Number(form.price) / originalTotal) * 100)
    : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price || form.productIds.length < 2) return
    onSave({ ...form, price: Number(form.price) })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="label">Nombre del pack / promoción *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="ej. Pack Tecnología, Combo Hogar..." required />
          </div>

          {/* Description */}
          <div>
            <label className="label">Descripción (opcional)</label>
            <textarea className="input resize-none h-20" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe qué incluye esta oferta..." />
          </div>

          {/* Product selector */}
          <div>
            <label className="label">
              Artículos incluidos *
              <span className="text-gray-400 font-normal ml-1">(mínimo 2)</span>
            </label>

            {/* Selected summary */}
            {selectedProducts.length > 0 && (
              <div className="mb-3 p-3 bg-brand-50 rounded-xl">
                <p className="text-xs font-semibold text-brand-700 mb-1.5">Seleccionados ({selectedProducts.length}):</p>
                <div className="flex flex-col gap-0.5">
                  {selectedProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 truncate flex-1">{p.title}</span>
                      <span className="text-gray-500 ml-2 shrink-0">${p.price} {p.currency}</span>
                    </div>
                  ))}
                  {originalTotal > 0 && (
                    <div className="border-t border-brand-200 pt-1 mt-1 flex justify-between text-xs font-semibold">
                      <span className="text-brand-700">Total individual:</span>
                      <span className="text-brand-700">${originalTotal}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-2">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar artículos disponibles..." />
            </div>

            {/* Product list */}
            <div className="max-h-48 overflow-y-auto flex flex-col gap-1 border border-gray-100 rounded-xl p-2">
              {availableProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No hay artículos disponibles. Primero agrega artículos con estado "Disponible".</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Sin resultados</p>
              ) : (
                filteredProducts.map(p => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      form.productIds.includes(p.id) ? 'bg-brand-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="w-4 h-4 rounded accent-brand-500 shrink-0"
                    />
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {p.imageUrl || (p.images && p.images[0]) ? (
                        <img src={p.imageUrl || p.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">🏷️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                      <p className="text-xs text-gray-400">${p.price} {p.currency}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Price + currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Precio del pack *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input className="input pl-7" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
              </div>
              {savings > 0 && (
                <p className="text-xs text-emerald-600 font-semibold mt-1">🎉 {savings}% de ahorro vs. individual</p>
              )}
            </div>
            <div>
              <label className="label">Moneda</label>
              <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
                <option value="USD">USD</option>
                <option value="Bs">Bs</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label">Visibilidad</label>
            <div className="flex gap-3 flex-wrap">
              {[['active', '✅ Activa (visible en la web)'], ['inactive', '⏸️ Inactiva (oculta)']].map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('status', val)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.status === val ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={form.productIds.length < 2}
              className="btn-primary flex-1 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} /> Guardar promoción
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
          </div>
          {form.productIds.length === 1 && (
            <p className="text-xs text-amber-600 text-center -mt-3">Selecciona al menos 2 artículos para crear el pack</p>
          )}
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
  const { bundles, addBundle, updateBundle, deleteBundle } = useBundles()
  const [view, setView] = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showBundleForm, setShowBundleForm] = useState(false)
  const [editBundle, setEditBundle] = useState(null)
  const [deleteBundleConfirm, setDeleteBundleConfirm] = useState(null)

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  const filtered = statusFilter === 'all' ? products : products.filter(p => p.status === statusFilter)
  const counts = {
    all:       products.length,
    available: products.filter(p => p.status === 'available').length,
    pending:   products.filter(p => p.status === 'pending').length,
    sold:      products.filter(p => p.status === 'sold').length,
    draft:     products.filter(p => p.status === 'draft').length,
  }

  const handleSaveNew = (data) => { addProduct(data); setShowForm(false) }
  const handleSaveEdit = (data) => { updateProduct(editProduct.id, data); setEditProduct(null) }
  const handleDelete = (id) => { deleteProduct(id); setDeleteConfirm(null) }
  const quickStatus = (id, status) => updateProduct(id, { status })

  const handleSaveBundle = (data) => {
    if (editBundle) { updateBundle(editBundle.id, data); setEditBundle(null) }
    else { addBundle(data); setShowBundleForm(false) }
  }

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

        {/* View toggle tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex border-t border-gray-100">
          {[['products', '📦 Artículos'], ['bundles', '🎁 Promociones']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                view === v
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              {v === 'bundles' && bundles.filter(b => b.status === 'active').length > 0 && (
                <span className="ml-1.5 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {bundles.filter(b => b.status === 'active').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Products view ── */}
        {view === 'products' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total artículos', value: counts.all, icon: <Package size={20} />, color: 'bg-gray-100 text-gray-700' },
                { label: 'Disponibles', value: counts.available, icon: <CheckCircle size={20} />, color: 'bg-emerald-50 text-emerald-700' },
                { label: 'Apartados', value: counts.pending, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-700' },
                { label: 'Vendidos', value: counts.sold, icon: <Tag size={20} />, color: 'bg-red-50 text-red-700' },
                { label: 'Borradores', value: counts.draft, icon: <span className="text-lg leading-none">📝</span>, color: 'bg-gray-50 text-gray-500' },
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
                {['all', 'available', 'pending', 'sold', 'draft'].map(s => (
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
          </>
        )}

        {/* ── Bundles view ── */}
        {view === 'bundles' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Packs y Promociones</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {bundles.filter(b => b.status === 'active').length} activas · {bundles.length} en total
                </p>
              </div>
              <button onClick={() => setShowBundleForm(true)} className="btn-primary">
                <Plus size={16} /> Nueva promoción
              </button>
            </div>

            {bundles.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <ShoppingBag size={48} className="mx-auto mb-4 opacity-25" />
                <p className="font-medium text-gray-600 mb-1">Aún no hay promociones</p>
                <p className="text-sm mb-6">Crea un pack para vender varios artículos juntos a un precio especial</p>
                <button onClick={() => setShowBundleForm(true)} className="btn-primary">
                  <Plus size={15} /> Crear primera promoción
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {bundles.map(bundle => {
                  const bundleProducts = (bundle.productIds || [])
                    .map(id => products.find(p => p.id === id))
                    .filter(Boolean)
                  const originalTotal = bundleProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0)
                  const savings = originalTotal > bundle.price
                    ? Math.round((1 - bundle.price / originalTotal) * 100)
                    : 0
                  return (
                    <div key={bundle.id} className="bg-white rounded-2xl shadow-card p-4 flex gap-4 items-start">
                      {/* Thumbnails */}
                      <div className="flex gap-1 shrink-0">
                        {bundleProducts.slice(0, 3).map(p => (
                          <div key={p.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            {p.imageUrl || (p.images && p.images[0]) ? (
                              <img src={p.imageUrl || p.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">🏷️</div>
                            )}
                          </div>
                        ))}
                        {bundleProducts.length > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            +{bundleProducts.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">{bundle.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            bundle.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {bundle.status === 'active' ? '✅ Activa' : '⏸️ Inactiva'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{bundleProducts.map(p => p.title).join(' · ')}</p>
                        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                          <span className="font-bold text-gray-900">${bundle.price} {bundle.currency}</span>
                          {savings > 0 && (
                            <span className="text-xs text-emerald-600 font-semibold">{savings}% ahorro</span>
                          )}
                          {originalTotal > 0 && savings > 0 && (
                            <span className="text-xs text-gray-400 line-through">${originalTotal} individual</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => updateBundle(bundle.id, { status: bundle.status === 'active' ? 'inactive' : 'active' })}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                          title={bundle.status === 'active' ? 'Desactivar' : 'Activar'}
                        >
                          {bundle.status === 'active'
                            ? <ToggleRight size={18} className="text-emerald-500" />
                            : <ToggleLeft size={18} className="text-gray-400" />
                          }
                        </button>
                        <button
                          onClick={() => setEditBundle(bundle)}
                          className="p-2 rounded-xl hover:bg-brand-50 transition-colors text-gray-400 hover:text-brand-600"
                          title="Editar"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => setDeleteBundleConfirm(bundle)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
                          title="Eliminar"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
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

      {showBundleForm && (
        <BundleForm
          title="Nueva promoción"
          products={products}
          onSave={handleSaveBundle}
          onCancel={() => setShowBundleForm(false)}
        />
      )}
      {editBundle && (
        <BundleForm
          title="Editar promoción"
          initial={{ ...editBundle, price: String(editBundle.price) }}
          products={products}
          onSave={handleSaveBundle}
          onCancel={() => setEditBundle(null)}
        />
      )}

      {/* Delete product confirm */}
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

      {/* Delete bundle confirm */}
      {deleteBundleConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🗑️</div>
              <h3 className="font-bold text-gray-900">¿Eliminar promoción?</h3>
              <p className="text-sm text-gray-500 mt-1">"{deleteBundleConfirm.title}"</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { deleteBundle(deleteBundleConfirm.id); setDeleteBundleConfirm(null) }} className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
                Eliminar
              </button>
              <button onClick={() => setDeleteBundleConfirm(null)} className="flex-1 btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
