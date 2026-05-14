'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import type { Category } from '@/lib/types'

export function useCategories(userId?: string) {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    setLoading(true)
    const supabase = createClient()
    ;(async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
        if (!cancelled && data && data.length > 0) setCategories(data as Category[])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [userId])

  return { categories, loading }
}
