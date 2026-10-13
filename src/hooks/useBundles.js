import { useState } from 'react'

const KEY = 'vg_bundles'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

function persist(bundles) {
  localStorage.setItem(KEY, JSON.stringify(bundles))
}

export function useBundles() {
  const [bundles, setBundles] = useState(load)

  const save = (next) => { setBundles(next); persist(next) }

  const addBundle    = (data) => save([...bundles, { ...data, id: crypto.randomUUID(), createdAt: Date.now() }])
  const updateBundle = (id, data) => save(bundles.map(b => b.id === id ? { ...b, ...data } : b))
  const deleteBundle = (id) => save(bundles.filter(b => b.id !== id))

  return { bundles, addBundle, updateBundle, deleteBundle }
}
