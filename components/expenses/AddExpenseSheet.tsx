'use client'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { NumPad } from './NumPad'
import { AmountDisplay } from './AmountDisplay'
import { CategoryPicker } from './CategoryPicker'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'
import { Check } from 'lucide-react'
import type { Category } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  userId?: string
  onSaved?: () => void
}

export function AddExpenseSheet({ open, onClose, userId, onSaved }: Props) {
  const [amount, setAmount] = useState('0')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('categories').select('*').eq('user_id', userId)
      if (data && data.length > 0) setCategories(data as Category[])
    }
    load()
  }, [userId])

  const handleKey = (key: string) => {
    setAmount(prev => {
      if (key === '⌫') {
        const next = prev.slice(0, -1)
        return next === '' || next === '-' ? '0' : next
      }
      if (key === '.' && prev.includes('.')) return prev
      if (prev === '0' && key !== '.') return key
      if (prev.length >= 8) return prev
      return prev + key
    })
  }

  const handleSave = async () => {
    const num = parseFloat(amount)
    if (!num || !categoryId) return

    if (userId) {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('expenses').insert({
        user_id: userId,
        category_id: categoryId,
        amount: num,
        note: note || null,
        date: today,
        is_recurring: false,
      })
    }

    setAmount('0')
    setCategoryId(null)
    setNote('')
    onSaved?.()
  }

  const isValid = parseFloat(amount) > 0 && !!categoryId

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent
        side="bottom"
        style={{
          background: '#F5EFE8',
          border: 'none',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '0 0 env(safe-area-inset-bottom)',
          maxHeight: '92vh',
          overflow: 'auto',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.12)' }} />
        </div>

        {/* Title */}
        <p style={{ fontWeight: 700, fontSize: 18, color: '#1A1410', textAlign: 'center', paddingTop: 8 }}>
          Add Expense
        </p>

        {/* Amount */}
        <AmountDisplay amount={amount} />

        {/* Note input */}
        <div style={{ padding: '0 20px 16px' }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              padding: '12px 16px',
              fontSize: 14,
              color: '#1A1410',
              outline: 'none',
              fontFamily: 'var(--font-urbanist), sans-serif',
            }}
          />
        </div>

        {/* Category picker */}
        <div style={{ padding: '0 20px 20px' }}>
          <CategoryPicker
            categories={categories}
            selected={categoryId}
            onSelect={setCategoryId}
          />
        </div>

        {/* Numpad */}
        <div style={{ padding: '0 20px 16px' }}>
          <NumPad onKey={handleKey} />
        </div>

        {/* Save button */}
        <div style={{ padding: '0 20px 24px' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 18,
              background: isValid ? '#D07850' : 'rgba(0,0,0,0.08)',
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-urbanist), sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: isValid ? '#fff' : '#A8998A',
              transition: 'all 200ms ease',
            }}
          >
            <Check size={18} />
            Save Expense
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
