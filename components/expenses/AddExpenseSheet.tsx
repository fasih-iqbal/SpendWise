'use client'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { NumPad } from './NumPad'
import { CategoryPicker } from './CategoryPicker'
import { createClient } from '@/lib/supabase/client'
import { useCurrency } from '@/lib/currency'
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
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (!userId) return
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name')
      setCategories((data ?? []) as Category[])
    }
    load()
  }, [userId, open])

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
    setSaving(true)
    try {
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
    } finally {
      setSaving(false)
    }
  }

  const isValid = parseFloat(amount) > 0 && !!categoryId

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        style={{
          background: '#F5EFE8',
          border: 'none',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 0,
          gap: 0,
          /* Use svh so Safari's dynamic toolbar doesn't eat the sheet */
          height: '92svh',
          maxHeight: '92svh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top fixed: handle + title + amount */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 2 }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.14)' }} />
          </div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1410', textAlign: 'center', padding: '4px 0 0' }}>
            Add Expense
          </p>
          <AmountDisplayCompact amount={amount} />
        </div>

        {/* Scrollable middle */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '0 20px 8px' }}>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note..."
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 14,
              color: '#1A1410',
              outline: 'none',
              fontFamily: 'var(--font-urbanist), sans-serif',
              marginBottom: 14,
            }}
          />
          <CategoryPicker
            categories={categories}
            selected={categoryId}
            onSelect={setCategoryId}
          />
        </div>

        {/* Fixed bottom: numpad + save button + safe-area spacer */}
        <div
          style={{
            flexShrink: 0,
            padding: '14px 20px 0',
            background: '#F5EFE8',
            borderTop: '1px solid rgba(0,0,0,0.04)',
            /* Generous lift above the iOS home bar */
            paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
          }}
        >
          <NumPad onKey={handleKey} />
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || saving}
            style={{
              marginTop: 12,
              marginBottom: 20,
              width: '100%',
              height: 52,
              borderRadius: 16,
              background: isValid ? '#D07850' : 'rgba(0,0,0,0.08)',
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-urbanist), sans-serif',
              fontWeight: 700,
              fontSize: 15,
              color: isValid ? '#fff' : '#A8998A',
              transition: 'all 200ms ease',
              boxShadow: isValid ? '0 6px 18px rgba(208,120,80,0.32)' : 'none',
            }}
          >
            <Check size={18} />
            {saving ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function AmountDisplayCompact({ amount }: { amount: string }) {
  const { currency } = useCurrency()
  const [intPart, decPart] = amount.includes('.') ? amount.split('.') : [amount, null]
  return (
    <div style={{ textAlign: 'center', padding: '8px 0 6px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 3 }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: '#D07850', paddingTop: 6 }}>{currency.symbol}</span>
        <span style={{ fontWeight: 800, fontSize: 36, color: '#1A1410', lineHeight: 1 }}>
          {intPart || '0'}
        </span>
        {decPart !== null && (
          <span style={{ fontWeight: 700, fontSize: 18, color: '#65574A', paddingTop: 6 }}>
            .{decPart}
          </span>
        )}
        <span
          className="cursor-blink"
          style={{ display: 'inline-block', width: 2, height: 28, background: '#D07850', borderRadius: 2, marginLeft: 4, alignSelf: 'center' }}
        />
      </div>
    </div>
  )
}
