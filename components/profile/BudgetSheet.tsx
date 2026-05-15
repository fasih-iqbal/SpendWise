'use client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Check, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCurrency } from '@/lib/currency'

interface Props {
  open: boolean
  onClose: () => void
  userId?: string
  current: number
  onSaved?: (next: number) => void
}

export function BudgetSheet({ open, onClose, userId, current, onSaved }: Props) {
  const { currency } = useCurrency()
  const [value, setValue] = useState(current ? String(current) : '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setValue(current ? String(current) : '')
  }, [open, current])

  const numeric = parseFloat(value)
  const valid = !Number.isNaN(numeric) && numeric > 0

  const save = async () => {
    if (!valid || !userId) return
    setSaving(true)
    try {
      const sb = createClient()
      await sb.from('profiles').update({ monthly_budget: numeric }).eq('id', userId)
      // Persist a per-month snapshot so history is preserved
      const now = new Date()
      await sb.from('budgets').upsert(
        {
          user_id: userId,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          total_budget: numeric,
        },
        { onConflict: 'user_id,month,year' },
      )
      onSaved?.(numeric)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

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
          height: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.14)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#65574A', fontSize: 13, fontFamily: 'inherit', padding: 4 }}
            >
              Cancel
            </button>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>Monthly Budget</p>
            <span style={{ width: 30 }} />
          </div>
        </div>

        <div style={{ padding: '4px 20px 24px' }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 18,
              border: '1px solid rgba(0,0,0,0.06)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#FBF1E7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Wallet size={20} color="#D07850" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#A8998A', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Budget for
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1410' }}>{monthLabel}</p>
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 700,
                fontSize: 18,
                color: '#D07850',
              }}
            >
              {currency.symbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="0"
              autoFocus
              style={{
                width: '100%',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 14,
                padding: '14px 16px 14px 36px',
                fontSize: 22,
                fontWeight: 700,
                color: '#1A1410',
                outline: 'none',
                fontFamily: 'var(--font-urbanist), sans-serif',
              }}
            />
          </div>

          <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 16, lineHeight: 1.5 }}>
            This becomes your monthly target. Update it any time — your previous month&apos;s budget is preserved in history.
          </p>

          <button
            type="button"
            onClick={save}
            disabled={!valid || saving}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              background: valid ? '#D07850' : 'rgba(0,0,0,0.08)',
              border: 'none',
              cursor: valid ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 15,
              color: valid ? '#fff' : '#A8998A',
              boxShadow: valid ? '0 6px 18px rgba(208,120,80,0.32)' : 'none',
            }}
          >
            <Check size={18} />
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
