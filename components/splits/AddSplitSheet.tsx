'use client'
import { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Check, UserPlus, X } from 'lucide-react'
import { useCurrency } from '@/lib/currency'
import { localISODate } from '@/lib/utils'
import type { Contact, Split } from '@/lib/hooks/useSplits'

interface Props {
  open: boolean
  onClose: () => void
  contacts: Contact[]
  meName: string
  onSave: (sp: Omit<Split, 'id' | 'createdAt'>) => void
  onAddContact: () => void
}

export function AddSplitSheet({ open, onClose, contacts, meName, onSave, onAddContact }: Props) {
  const { currency } = useCurrency()
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [payerId, setPayerId] = useState('me')
  const [participants, setParticipants] = useState<Set<string>>(new Set(['me']))

  useEffect(() => {
    if (open) {
      setAmount(''); setNote(''); setPayerId('me'); setParticipants(new Set(['me']))
    }
  }, [open])

  const numeric = parseFloat(amount)
  const valid = !Number.isNaN(numeric) && numeric > 0 && participants.size >= 2 && participants.has(payerId)

  const share = useMemo(() => {
    if (!valid) return 0
    return numeric / participants.size
  }, [valid, numeric, participants.size])

  const toggle = (id: string) => {
    setParticipants(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (id === payerId) return prev // payer must remain participant
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const submit = () => {
    if (!valid) return
    onSave({
      payerId,
      participantIds: Array.from(participants),
      totalAmount: numeric,
      note: note || undefined,
      date: localISODate(),
    })
    onClose()
  }

  const allPeople: { id: string; name: string }[] = [{ id: 'me', name: meName }, ...contacts.map(c => ({ id: c.id, name: c.name }))]

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
          maxHeight: '92svh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.14)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 8px' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>New Split</p>
            <span style={{ width: 50 }} />
          </div>
        </div>

        <div style={{ overflowY: 'auto', minHeight: 0, padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Amount">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#D07850', fontSize: 18 }}>
                {currency.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                style={{ ...inputStyle, padding: '12px 14px 12px 34px', fontWeight: 700, fontSize: 18 }}
              />
            </div>
          </Field>

          <Field label="Note (optional)">
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Lunch at Cafe"
              style={inputStyle}
            />
          </Field>

          <Field label="Paid by">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {allPeople.map(p => {
                const active = payerId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPayerId(p.id)
                      setParticipants(prev => {
                        const next = new Set(prev)
                        next.add(p.id)
                        return next
                      })
                    }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      background: active ? '#D07850' : '#fff',
                      color: active ? '#fff' : '#1A1410',
                      border: active ? 'none' : '1px solid rgba(0,0,0,0.08)',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {p.name}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label={`Split between (${participants.size})`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {allPeople.map(p => {
                const checked = participants.has(p.id)
                return (
                  <label
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      background: '#fff',
                      borderRadius: 12,
                      padding: '10px 14px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(p.id)}
                      style={{ width: 18, height: 18, accentColor: '#D07850' }}
                    />
                    <span style={{ flex: 1, fontSize: 14, color: '#1A1410', fontWeight: 500 }}>{p.name}</span>
                    {checked && share > 0 && (
                      <span style={{ fontSize: 12, color: '#65574A', fontWeight: 700 }}>
                        {currency.symbol}{share.toFixed(2)}
                      </span>
                    )}
                  </label>
                )
              })}
              <button
                type="button"
                onClick={onAddContact}
                style={{
                  marginTop: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'transparent',
                  border: '1px dashed rgba(0,0,0,0.18)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: '#D07850',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                <UserPlus size={16} /> Add Person
              </button>
            </div>
          </Field>

          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            style={{
              marginTop: 4,
              height: 50,
              borderRadius: 14,
              border: 'none',
              background: valid ? '#D07850' : 'rgba(0,0,0,0.08)',
              color: valid ? '#fff' : '#A8998A',
              fontWeight: 700,
              fontSize: 15,
              cursor: valid ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit',
            }}
          >
            {valid ? <Check size={18} /> : <X size={18} />}
            Save Split
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const btnGhost: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#65574A', fontSize: 13, fontFamily: 'inherit', padding: 4,
  width: 50, textAlign: 'left',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#65574A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </p>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#fff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 14,
  color: '#1A1410',
  outline: 'none',
  fontFamily: 'var(--font-urbanist), sans-serif',
}
