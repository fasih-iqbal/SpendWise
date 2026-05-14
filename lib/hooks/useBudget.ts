'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_DASHBOARD } from '@/lib/mock-data'
import type { DashboardStats } from '@/lib/types'

export function useBudget(userId?: string) {
  const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    const supabase = createClient()
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    ;(async () => {
      try {
        const [profileRes, expRes] = await Promise.all([
          supabase.from('profiles').select('monthly_budget').eq('id', userId).single(),
          supabase.from('expenses').select('amount').eq('user_id', userId).gte('date', monthStart),
        ])
        if (cancelled) return
        const budget = profileRes.data?.monthly_budget ?? 3500
        const spent = (expRes.data ?? []).reduce((s, e) => s + Number(e.amount), 0)
        setStats({
          totalBudget: budget,
          totalSpent: spent,
          totalRemaining: budget - spent,
          percentUsed: Math.min(100, Math.round((spent / budget) * 100)),
          income: 4200,
          saved: Math.max(0, budget - spent),
        })
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [userId])

  return { stats, loading }
}
