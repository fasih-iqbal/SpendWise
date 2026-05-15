'use client'
import { useEffect, useRef, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Check, UserPlus } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  /** Returns the new contact's id so the caller can chain (e.g. pre-toggle in a split). */
  onAdd: (name: string) => string | void
}

export function AddContactSheet({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setName('')
    // Defer focus so Radix has finished mounting + iOS keyboard pops reliably
    const id = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(id)
  }, [open])

  const valid = name.trim().length > 0

  const submit = () => {
    if (!valid) return
    onAdd(name.trim())
    onClose()
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); submit() }
  }

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
          /* keep above iOS home bar even when keyboard is closed */
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: 'rgba(0,0,0,0.14)' }} />
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#65574A', fontSize: 13, fontFamily: 'inherit', padding: 4, width: 56, textAlign: 'left' }}
          >
            Cancel
          </button>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>Add Person</p>
          <span style={{ width: 56 }} />
        </div>

        {/* Body */}
        <div style={{ padding: '4px 20px 16px' }}>
          {/* Avatar preview */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#FBE7D9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#A85D3A', fontWeight: 700, fontSize: 22,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {initials(name) || <UserPlus size={26} color="#A85D3A" strokeWidth={2} />}
            </div>
          </div>

          {/* Input */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 12,
            }}
          >
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={onKey}
              placeholder="e.g. Ali, Sara, John"
              autoComplete="off"
              autoCapitalize="words"
              enterKeyHint="done"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 16,
                color: '#1A1410',
                fontFamily: 'var(--font-urbanist), sans-serif',
                fontWeight: 500,
              }}
            />
            {name && (
              <button
                type="button"
                onClick={() => { setName(''); inputRef.current?.focus() }}
                aria-label="Clear"
                style={{
                  background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%',
                  width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#65574A', fontSize: 13, lineHeight: 1,
                }}
              >
                ×
              </button>
            )}
          </label>

          <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 16, paddingLeft: 4 }}>
            Stored locally on this device. They won&apos;t get a notification.
          </p>

          {/* Save — sticky-feel, always reachable */}
          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              border: 'none',
              background: valid ? '#D07850' : 'rgba(0,0,0,0.08)',
              color: valid ? '#fff' : '#A8998A',
              fontWeight: 700,
              fontSize: 15,
              cursor: valid ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit',
              boxShadow: valid ? '0 6px 18px rgba(208,120,80,0.32)' : 'none',
              transition: 'all 200ms ease',
            }}
          >
            <Check size={18} />
            Add Person
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}
