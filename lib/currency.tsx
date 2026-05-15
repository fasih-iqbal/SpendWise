'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CurrencyDef } from './types'

export const CURRENCIES: CurrencyDef[] = [
  { code: 'USD', symbol: '$',  name: 'US Dollar',         flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', symbol: '€',  name: 'Euro',              flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', symbol: '£',  name: 'Pound Sterling',    flag: '🇬🇧', locale: 'en-GB' },
  { code: 'PKR', symbol: '₨',  name: 'Pakistani Rupee',   flag: '🇵🇰', locale: 'ur-PK' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee',      flag: '🇮🇳', locale: 'en-IN' },
  { code: 'AED', symbol: 'د.إ',name: 'UAE Dirham',        flag: '🇦🇪', locale: 'en-AE' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',      flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',   flag: '🇨🇦', locale: 'en-CA' },
]

interface Ctx {
  currency: CurrencyDef
  setCurrency: (code: string) => void
  format: (n: number, opts?: { compact?: boolean; decimals?: number }) => string
}

const STORAGE_KEY = 'spendwise-currency'
const CurrencyContext = createContext<Ctx | null>(null)

/** Read localStorage synchronously so there is NO flash of the wrong currency. */
function readStoredCode(): string {
  if (typeof window === 'undefined') return 'USD'
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && CURRENCIES.some(c => c.code === v)) return v
  } catch {}
  return 'USD'
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Lazy initialiser — runs synchronously on first render, no useEffect flash
  const [code, setCode] = useState<string>(readStoredCode)

  // Also respond to storage events from other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && CURRENCIES.some(c => c.code === e.newValue)) {
        setCode(e.newValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const currency = CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0]

  const setCurrency = (next: string) => {
    setCode(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  const format = (n: number, opts?: { compact?: boolean; decimals?: number }) => {
    const decimals = opts?.decimals ?? 2
    if (opts?.compact && Math.abs(n) >= 1000) {
      const v = n / 1000
      return `${currency.symbol}${v.toFixed(v >= 100 ? 0 : 1)}k`
    }
    const formatted = new Intl.NumberFormat(currency.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n)
    return `${currency.symbol}${formatted}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
