import { useState, useCallback } from 'react'
import { ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD, SETTINGS_KEY, SITE_CONFIG } from '../config'

function getStoredPassword() {
  try {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD
  } catch {
    return DEFAULT_ADMIN_PASSWORD
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY)
      return stored ? JSON.parse(stored) : { whatsapp: SITE_CONFIG.whatsappNumber }
    } catch {
      return { whatsapp: SITE_CONFIG.whatsappNumber }
    }
  })

  const saveSettings = useCallback((updates) => {
    const next = { ...settings, ...updates }
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)) } catch {}
    setSettings(next)
  }, [settings])

  return { settings, saveSettings }
}

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem('vg_admin_auth') === 'true' } catch { return false }
  })

  const login = useCallback((password) => {
    const correct = getStoredPassword()
    if (password === correct) {
      try { sessionStorage.setItem('vg_admin_auth', 'true') } catch {}
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    try { sessionStorage.removeItem('vg_admin_auth') } catch {}
    setIsAuthenticated(false)
  }, [])

  const changePassword = useCallback((current, next) => {
    const correct = getStoredPassword()
    if (current !== correct) return false
    try { localStorage.setItem(ADMIN_PASSWORD_KEY, next) } catch {}
    return true
  }, [])

  return { isAuthenticated, login, logout, changePassword }
}
