'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_EXPENSES } from '@/lib/mock-data'
import type { Expense } from '@/lib/types'

export function useExpenses(userId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    const supabase = createClient()
    ;(async () => {
      try {
        const { data } = await supabase
          .from('expenses')
          .select('*, category:categories(*)')
          .eq('user_id', userId)
          .order('date', { ascending: false })
        if (!cancelled && data && data.length > 0) setExpenses(data as Expense[])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [userId])

  const addExpense = async (exp: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase
      .from('expenses')
      .insert({ ...exp, user_id: userId })
      .select()
      .single()
    if (data) setExpenses(prev => [data as Expense, ...prev])
  }

  return { expenses, loading, addExpense }
}
