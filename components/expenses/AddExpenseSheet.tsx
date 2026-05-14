'use client'
import { useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { NumPad } from './NumPad'
import { AmountDisplay } from './AmountDisplay'
import { CategoryPicker } from './CategoryPicker'
import { MOCK_CATEGORIES } from '@/lib/mock-data'
import { Check } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onSave?: (data: { amount: number; categoryId: string; note: string }) => void
}

export function AddExpenseSheet({ open, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('0')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [note, setNote] = useState('')

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

  const handleSave = () => {
    const num = parseFloat(amount)
    if (!num || !categoryId) return
    onSave?.({ amount: num, categoryId, note })
    setAmount('0')
    setCategoryId(null)
    setNote('')
    onClose()
  }

  const isValid = parseFloat(amount) > 0 && !!categoryId

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent
        side="bottom"
        style={{
          background: 'rgb(var(--bg-surface))',
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
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 999,
              background: 'rgba(var(--border), 0.15)',
            }}
          />
        </div>

        {/* Title */}
        <p
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 18,
            color: 'rgb(var(--text-1))',
            textAlign: 'center',
            paddingTop: 8,
          }}
        >
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
              background: 'rgb(var(--bg-card))',
              border: '1px solid rgba(var(--border), 0.08)',
              borderRadius: 14,
              padding: '12px 16px',
              fontFamily: 'var(--font-dm)',
              fontSize: 14,
              color: 'rgb(var(--text-1))',
              outline: 'none',
            }}
          />
        </div>

        {/* Category picker */}
        <div style={{ padding: '0 20px 20px' }}>
          <CategoryPicker
            categories={MOCK_CATEGORIES}
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
            onClick={handleSave}
            disabled={!isValid}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 18,
              background: isValid
                ? 'linear-gradient(135deg, #5B6EF5, #2DD4BF)'
                : 'rgba(var(--dim))',
              border: 'none',
              cursor: isValid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 16,
              color: isValid ? '#fff' : 'rgb(var(--text-3))',
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
