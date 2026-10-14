import { useState, useCallback } from 'react'
import { PRODUCTS_KEY } from '../config'
import { seedProducts } from '../data/seedProducts'

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return null
}

function saveToStorage(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    return { ok: true }
  } catch (e) {
    const isQuota = e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014
    return { ok: false, quota: isQuota }
  }
}

export function useProducts() {
  const [products, setProducts] = useState(() => loadFromStorage() || seedProducts)
  const [storageWarning, setStorageWarning] = useState(false)

  const save = useCallback((updated) => {
    const result = saveToStorage(updated)
    setStorageWarning(!result.ok)
    setProducts(updated)
  }, [])

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: 'prod_' + Date.now(),
      createdAt: new Date().toISOString(),
    }
    save([newProduct, ...products])
    return newProduct
  }, [products, save])

  const updateProduct = useCallback((id, updates) => {
    save(products.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [products, save])

  const deleteProduct = useCallback((id) => {
    save(products.filter(p => p.id !== id))
  }, [products, save])

  const resetToSeed = useCallback(() => {
    save(seedProducts)
  }, [save])

  // Frees space by removing embedded images from sold products (keeps data, removes base64)
  const freeUpSpace = useCallback(() => {
    const cleaned = products.map(p =>
      p.status === 'sold'
        ? { ...p, images: p.images?.map(() => '') ?? [], imageUrl: '' }
        : p
    )
    save(cleaned)
  }, [products, save])

  const refresh = useCallback(() => {
    setProducts(loadFromStorage() || seedProducts)
  }, [])

  return { products, addProduct, updateProduct, deleteProduct, resetToSeed, refresh, storageWarning, freeUpSpace }
}
