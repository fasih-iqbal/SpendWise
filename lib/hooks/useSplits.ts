'use client'
import { useCallback, useEffect, useState } from 'react'

export interface Contact {
  id: string
  name: string
}

export interface Split {
  id: string
  /** 'me' or contact id */
  payerId: string
  /** participant ids — must include payer + at least one other */
  participantIds: string[]
  totalAmount: number
  note?: string
  date: string
  createdAt: string
}

interface State {
  contacts: Contact[]
  splits: Split[]
}

const KEY = 'spendwise-splits'

function load(userId: string): State {
  if (typeof window === 'undefined') return { contacts: [], splits: [] }
  try {
    const raw = localStorage.getItem(`${KEY}:${userId}`)
    if (!raw) return { contacts: [], splits: [] }
    const parsed = JSON.parse(raw) as State
    return {
      contacts: parsed.contacts ?? [],
      splits: parsed.splits ?? [],
    }
  } catch {
    return { contacts: [], splits: [] }
  }
}

function persist(userId: string, state: State) {
  try { localStorage.setItem(`${KEY}:${userId}`, JSON.stringify(state)) } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function useSplits(userId: string | undefined) {
  const [state, setState] = useState<State>({ contacts: [], splits: [] })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!userId) { setState({ contacts: [], splits: [] }); setHydrated(true); return }
    setState(load(userId))
    setHydrated(true)
  }, [userId])

  useEffect(() => {
    if (!userId || !hydrated) return
    persist(userId, state)
  }, [state, userId, hydrated])

  const addContact = useCallback((name: string): Contact => {
    const c: Contact = { id: uid(), name: name.trim() }
    setState(s => ({ ...s, contacts: [...s.contacts, c] }))
    return c
  }, [])

  const removeContact = useCallback((id: string) => {
    setState(s => ({
      contacts: s.contacts.filter(c => c.id !== id),
      // Drop any split that references this contact to avoid dangling balances
      splits: s.splits.filter(sp => sp.payerId !== id && !sp.participantIds.includes(id)),
    }))
  }, [])

  const addSplit = useCallback((sp: Omit<Split, 'id' | 'createdAt'>) => {
    const split: Split = { ...sp, id: uid(), createdAt: new Date().toISOString() }
    setState(s => ({ ...s, splits: [split, ...s.splits] }))
    return split
  }, [])

  const removeSplit = useCallback((id: string) => {
    setState(s => ({ ...s, splits: s.splits.filter(sp => sp.id !== id) }))
  }, [])

  // Net balance per contact relative to me.
  // Positive => contact owes me. Negative => I owe contact.
  const balances = (() => {
    const map = new Map<string, number>()
    for (const c of state.contacts) map.set(c.id, 0)
    for (const sp of state.splits) {
      if (sp.participantIds.length === 0) continue
      const share = sp.totalAmount / sp.participantIds.length
      if (sp.payerId === 'me') {
        for (const pid of sp.participantIds) {
          if (pid === 'me') continue
          map.set(pid, (map.get(pid) ?? 0) + share)
        }
      } else {
        // A contact paid. I owe them my share if I was a participant.
        if (sp.participantIds.includes('me')) {
          map.set(sp.payerId, (map.get(sp.payerId) ?? 0) - share)
        }
      }
    }
    return map
  })()

  const totalOwedToMe = Array.from(balances.values()).filter(v => v > 0).reduce((s, v) => s + v, 0)
  const totalIOwe    = Array.from(balances.values()).filter(v => v < 0).reduce((s, v) => s - v, 0)

  return {
    contacts: state.contacts,
    splits: state.splits,
    balances,
    totalOwedToMe,
    totalIOwe,
    addContact,
    removeContact,
    addSplit,
    removeSplit,
    hydrated,
  }
}
