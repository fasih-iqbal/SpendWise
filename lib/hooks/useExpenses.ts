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

  useEffect(() => { refresh() }, [refresh])

  const addExpense = useCallback(async (exp: NewExpense) => {
    if (!userId) return
    const sb = createClient()
    const { data } = await sb
      .from('expenses')
      .insert({ ...exp, user_id: userId, is_recurring: exp.is_recurring ?? false })
      .select()
      .single()
    if (data) setExpenses(prev => [data as Expense, ...prev])
  }, [userId])

  const removeExpense = useCallback(async (id: string) => {
    const sb = createClient()
    await sb.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  return { expenses, loading, refresh, addExpense, removeExpense }
}
