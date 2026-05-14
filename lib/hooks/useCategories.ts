'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

interface NewCategory {
  name: string
  emoji: string
  color: string
  budget_limit?: number
}

export function useCategories(userId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) { setCategories([]); setLoading(false); return }
    setLoading(true)
    const sb = createClient()
    const { data } = await sb
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    setCategories((data ?? []) as Category[])
    setLoading(false)
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  const addCategory = useCallback(async (c: NewCategory) => {
    if (!userId) return null
    const sb = createClient()
    const { data } = await sb
      .from('categories')
      .insert({ ...c, user_id: userId, budget_limit: c.budget_limit ?? 0 })
      .select()
      .single()
    if (data) setCategories(prev => [...prev, data as Category].sort((a, b) => a.name.localeCompare(b.name)))
    return data as Category | null
  }, [userId])

  const updateCategory = useCallback(async (id: string, patch: Partial<NewCategory>) => {
    const sb = createClient()
    const { data } = await sb
      .from('categories')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (data) setCategories(prev => prev.map(c => c.id === id ? (data as Category) : c))
  }, [])

  const removeCategory = useCallback(async (id: string) => {
    const sb = createClient()
    await sb.from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  return { categories, loading, refresh, addCategory, updateCategory, removeCategory }
}
