import { useState, useEffect, useCallback } from 'react'
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
  } catch {}
}

export function useProducts() {
  const [products, setProducts] = useState(() => loadFromStorage() || seedProducts)

  const refresh = useCallback(() => {
    setProducts(loadFromStorage() || seedProducts)
  }, [])

  const save = useCallback((updated) => {
    saveToStorage(updated)
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

  return { products, addProduct, updateProduct, deleteProduct, resetToSeed, refresh }
}
