'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Expense } from '@/lib/types'

interface NewExpense {
  category_id: string
  amount: number
  note?: string | null
  date: string
  channel?: 'online' | 'offline'
  is_recurring?: boolean
  recurrence_type?: 'weekly' | 'monthly'
}

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) { setExpenses([]); setLoading(false); return }
    setLoading(true)
    const sb = createClient()
    const { data } = await sb
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    setExpenses((data ?? []) as Expense[])
    setLoading(false)
  }, [userId])

  // Initial fetch
  useEffect(() => { refresh() }, [refresh])

  // ── Realtime subscription ───────────────────────────────────────────────
  // Any INSERT / UPDATE / DELETE on the expenses table for this user
  // triggers an immediate re-fetch so charts update without any user action.
  useEffect(() => {
    if (!userId) return
    const sb = createClient()
    const channel = sb
      .channel(`expenses:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',           // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Re-fetch on any change so all charts (WeeklyChart, DonutChart,
          // TransactionList, hero card) update in real time.
          refresh()
        },
      )
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [userId, refresh])

  // Refresh whenever the tab regains focus / visibility — guarantees
  // analytics & dashboard always show current data even if the realtime
  // websocket dropped or the Supabase publication isn't enabled.
  useEffect(() => {
    if (!userId) return
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId, refresh])
  // ────────────────────────────────────────────────────────────────────────

  const addExpense = useCallback(async (exp: NewExpense) => {
    if (!userId) return
    const sb = createClient()
    const { data } = await sb
      .from('expenses')
      .insert({ ...exp, user_id: userId, is_recurring: exp.is_recurring ?? false })
      .select()
      .single()
    // Optimistic update + realtime will also fire for consistency
    if (data) setExpenses(prev => [data as Expense, ...prev])
  }, [userId])

  const removeExpense = useCallback(async (id: string) => {
    const sb = createClient()
    await sb.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  return { expenses, loading, refresh, addExpense, removeExpense }
}
