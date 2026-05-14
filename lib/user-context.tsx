'use client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from './supabase/client'

export interface AppUser {
  id: string
  name: string
  email: string
  monthly_budget: number
  avatar_url?: string
  currency?: string
  setup_complete?: boolean
}

interface Ctx {
  user: AppUser | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<Ctx | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const sb = createClient()
      const { data: { user: auth } } = await sb.auth.getUser()
      if (!auth) { setUser(null); return }
      const { data: profile } = await sb
        .from('profiles')
        .select('id,name,email,avatar_url,currency,monthly_budget,setup_complete')
        .eq('id', auth.id)
        .single()
      const fallbackName = auth.email?.split('@')[0] ?? 'User'
      setUser({
        id: auth.id,
        name: profile?.name ?? fallbackName,
        email: profile?.email ?? auth.email ?? '',
        avatar_url: profile?.avatar_url ?? undefined,
        currency: profile?.currency ?? 'USD',
        monthly_budget: Number(profile?.monthly_budget ?? 0),
        setup_complete: profile?.setup_complete ?? false,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    const sb = createClient()
    await sb.auth.signOut()
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i)
        if (k && k.startsWith('spendwise-pin-unlocked-')) sessionStorage.removeItem(k)
      }
    } catch {}
    setUser(null)
  }, [])

  useEffect(() => {
    load()
    const sb = createClient()
    const { data: sub } = sb.auth.onAuthStateChange(() => { load() })
    return () => { sub.subscription.unsubscribe() }
  }, [load])

  return (
    <UserContext.Provider value={{ user, loading, refresh: load, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
