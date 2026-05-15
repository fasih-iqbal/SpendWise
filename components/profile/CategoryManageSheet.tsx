'use client'
import { useState } from 'react'
import React from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EMOJI_OPTIONS, COLOR_OPTIONS } from '@/lib/constants'
import type { Category } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  categories: Category[]
  onAdd: (c: { name: string; emoji: string; color: string; budget_limit?: number }) => Promise<void> | void
  onUpdate: (id: string, patch: { name?: string; emoji?: string; color?: string; budget_limit?: number }) => Promise<void> | void
  onRemove: (id: string) => Promise<void> | void
  /** Open directly in 'add' form instead of list */
  initialMode?: 'list' | 'add'
}

export function CategoryManageSheet({ open, onClose, categories, onAdd, onUpdate, onRemove, initialMode = 'list' }: Props) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>(initialMode)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0])
  const [color, setColor] = useState(COLOR_OPTIONS[0])
  const [budget, setBudget] = useState('')
  const [busy, setBusy] = useState(false)

  // Sync mode when sheet re-opens with a different initialMode
  const prevOpen = React.useRef(false)
  React.useEffect(() => {
    if (open && !prevOpen.current) {
      setMode(initialMode)
      resetForm()
    }
    prevOpen.current = open
  }, [open, initialMode])

  const resetForm = () => {
    setName(''); setEmoji(EMOJI_OPTIONS[0]); setColor(COLOR_OPTIONS[0]); setBudget(''); setEditing(null)
  }

  const startAdd = () => { resetForm(); setMode('add') }
  const startEdit = (c: Category) => {
    setEditing(c); setName(c.name); setEmoji(c.emoji); setColor(c.color); setBudget(String(c.budget_limit ?? '')); setMode('edit')
  }

  const submit = async () => {
    if (!name.trim()) return
    setBusy(true)
    try {
      const payload = { name: name.trim(), emoji, color, budget_limit: Number(budget) || 0 }
      if (mode === 'edit' && editing) await onUpdate(editing.id, payload)
      else await onAdd(payload)
      resetForm(); setMode('list')
    } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this category? Existing expenses keep their record but lose this label.')) return
    await onRemove(id)
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
              onClick={() => mode === 'list' ? onClose() : (resetForm(), setMode('list'))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#65574A', fontSize: 13, fontFamily: 'inherit', padding: 4 }}
            >
              {mode === 'list' ? 'Close' : 'Back'}
            </button>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>
              {mode === 'list' ? 'Manage Categories' : mode === 'add' ? 'New Category' : 'Edit Category'}
            </p>
            {mode === 'list' ? (
              <button
                type="button"
                onClick={startAdd}
                style={{
                  background: '#D07850', color: '#fff', border: 'none', borderRadius: 999,
                  width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
                aria-label="Add category"
              >
                <Plus size={16} />
              </button>
            ) : <span style={{ width: 30 }} />}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '0 20px 24px' }}>
          <AnimatePresence mode="wait">
            {mode === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {categories.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#A8998A', fontSize: 13, padding: '24px 0' }}>
                    No categories yet. Tap + to create one.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {categories.map(cat => (
                      <div
                        key={cat.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: '#fff', borderRadius: 14, padding: '10px 14px',
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410' }}>{cat.name}</p>
                          <p style={{ fontSize: 11, color: '#A8998A' }}>
                            Limit: {cat.budget_limit ? `${cat.budget_limit}` : 'none'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                          aria-label="Edit"
                        >
                          <Pencil size={16} color="#65574A" />
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(cat.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}
                          aria-label="Delete"
                        >
                          <Trash2 size={16} color="#D03C3C" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {(mode === 'add' || mode === 'edit') && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <Field label="Name">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Coffee"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Emoji">
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6,
                    background: '#fff', borderRadius: 14, padding: 10, border: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    {EMOJI_OPTIONS.map(e => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        style={{
                          fontSize: 18,
                          background: e === emoji ? `${color}25` : 'transparent',
                          border: e === emoji ? `1.5px solid ${color}` : '1.5px solid transparent',
                          borderRadius: 8,
                          padding: '4px 0',
                          cursor: 'pointer',
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Color">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {COLOR_OPTIONS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: c, cursor: 'pointer',
                          border: c === color ? '3px solid #1A1410' : '2px solid rgba(0,0,0,0.08)',
                          boxShadow: c === color ? `0 0 0 3px ${c}33` : 'none',
                        }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Monthly Budget (optional)">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="0"
                    style={inputStyle}
                  />
                </Field>

                <button
                  type="button"
                  onClick={submit}
                  disabled={!name.trim() || busy}
                  style={{
                    marginTop: 8,
                    height: 50,
                    borderRadius: 14,
                    border: 'none',
                    background: name.trim() ? '#D07850' : 'rgba(0,0,0,0.08)',
                    color: name.trim() ? '#fff' : '#A8998A',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: name.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'inherit',
                  }}
                >
                  {busy ? <X size={18} /> : <Check size={18} />}
                  {busy ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Create Category')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  )
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
