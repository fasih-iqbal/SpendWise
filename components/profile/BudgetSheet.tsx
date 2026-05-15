'use client'
import { useEffect, useRef, useState } from 'react'
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

const QUICK_PRESETS = [500, 1000, 2000, 5000]

export function BudgetSheet({ open, onClose, userId, current, onSaved }: Props) {
  const { currency } = useCurrency()
  const [value, setValue] = useState(current ? String(current) : '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setValue(current ? String(current) : '')
    // Defer focus so iOS keyboard pops reliably and input is visible
    const id = window.setTimeout(() => inputRef.current?.focus(), 140)
    return () => window.clearTimeout(id)
  }, [open, current])

  const numeric = parseFloat(value)
  const valid = !Number.isNaN(numeric) && numeric > 0

  const save = async () => {
    if (!valid || !userId) return
    setSaving(true)
    try {
      const sb = createClient()
      await sb.from('profiles').update({ monthly_budget: numeric }).eq('id', userId)
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

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); save() }
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
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.14)' }} />
        </div>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#65574A', fontSize: 13, fontFamily: 'inherit', padding: 4, width: 56, textAlign: 'left' }}
          >
            Cancel
          </button>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>Monthly Budget</p>
          <span style={{ width: 56 }} />
        </div>

        {/* Body */}
        <div style={{ padding: '4px 20px 16px' }}>
          {/* Month context */}
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: 14,
              border: '1px solid rgba(0,0,0,0.06)',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: '#FBF1E7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Wallet size={18} color="#D07850" strokeWidth={2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 10, color: '#A8998A', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Budget for
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1410' }}>{monthLabel}</p>
            </div>
          </div>

          {/* Amount input */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 16,
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 22, color: '#D07850' }}>
              {currency.symbol}
            </span>
            <input
              ref={inputRef}
              type="number"
              inputMode="decimal"
              enterKeyHint="done"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={onKey}
              placeholder="0"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 24,
                fontWeight: 700,
                color: '#1A1410',
                fontFamily: 'var(--font-urbanist), sans-serif',
                minWidth: 0,
                width: '100%',
              }}
            />
            {value && (
              <button
                type="button"
                onClick={() => { setValue(''); inputRef.current?.focus() }}
                aria-label="Clear"
                style={{
                  background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
                  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#65574A', fontSize: 13, lineHeight: 1, flexShrink: 0,
                }}
              >
                ×
              </button>
            )}
          </label>

          {/* Quick presets */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {QUICK_PRESETS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => { setValue(String(p)); inputRef.current?.focus() }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1A1410',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {currency.symbol}{p.toLocaleString()}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 16, lineHeight: 1.5, paddingLeft: 4 }}>
            Becomes your target for {monthLabel}. Update any time — previous months are preserved.
          </p>

          {/* Save */}
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
              transition: 'all 200ms ease',
            }}
          >
            <Check size={18} />
            {saving ? 'Saving...' : current ? 'Update Budget' : 'Set Budget'}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
