'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_GOALS } from '@/lib/mock-data'
import type { Goal } from '@/lib/types'

export function useGoals(userId?: string) {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    const supabase = createClient()
    ;(async () => {
      try {
        const { data } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', userId)
        if (!cancelled && data && data.length > 0) setGoals(data as Goal[])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [userId])

  return { goals, loading }
}
