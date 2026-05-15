'use client'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Check } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (name: string) => void
}

export function AddContactSheet({ open, onClose, onAdd }: Props) {
  const [name, setName] = useState('')

  useEffect(() => { if (open) setName('') }, [open])

  const valid = name.trim().length > 0

  const submit = () => {
    if (!valid) return
    onAdd(name.trim())
    onClose()
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
          maxHeight: '60vh',
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
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>Add Person</p>
            <span style={{ width: 40 }} />
          </div>
        </div>

        <div style={{ padding: '4px 20px 24px' }}>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            autoFocus
            style={{
              width: '100%',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 14,
              padding: '14px 16px',
              fontSize: 16,
              color: '#1A1410',
              outline: 'none',
              fontFamily: 'var(--font-urbanist), sans-serif',
              marginBottom: 16,
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!valid}
            style={{
              width: '100%',
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
            <Check size={18} />
            Add
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
