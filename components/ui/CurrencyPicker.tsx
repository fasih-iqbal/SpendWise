'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { CURRENCIES, useCurrency } from '@/lib/currency'

interface Props {
  variant?: 'compact' | 'full'
  align?: 'left' | 'right'
}

const SAFE_GAP = 16
/* Show ~3 rows then scroll (item ≈ 52px + container padding 16). */
const ROW_HEIGHT = 52
const VISIBLE_ROWS = 3
const PREFERRED_MAX = ROW_HEIGHT * VISIBLE_ROWS + 16
const MIN_HEIGHT = 120
const PANEL_WIDTH = 260

interface PanelPos {
  top: number
  left: number
  maxHeight: number
  direction: 'down' | 'up'
}

export function CurrencyPicker({ variant = 'compact', align = 'right' }: Props) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PanelPos | null>(null)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Outside click / Escape close
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Compute fixed-position coords + flip direction based on viewport room.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const compute = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const below = vh - rect.bottom - SAFE_GAP
      const above = rect.top - SAFE_GAP
      const direction: 'down' | 'up' = (below >= MIN_HEIGHT || below >= above) ? 'down' : 'up'
      const maxHeight = Math.max(MIN_HEIGHT, Math.min(PREFERRED_MAX, direction === 'down' ? below : above))
      const width = Math.min(PANEL_WIDTH, vw - 24)
      const leftAligned = align === 'left' ? rect.left : rect.right - width
      const left = Math.min(Math.max(8, leftAligned), vw - width - 8)
      const top = direction === 'down' ? rect.bottom + 8 : rect.top - 8 - maxHeight
      setPos({ top, left, maxHeight, direction })
    }
    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, true)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('scroll', compute, true)
    }
  }, [open, align])

  const panel = open && pos && mounted ? createPortal(
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        key="currency-panel"
        initial={{ opacity: 0, y: pos.direction === 'down' ? -8 : 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: pos.direction === 'down' ? -8 : 8, scale: 0.96 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        role="listbox"
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: PANEL_WIDTH,
          maxHeight: pos.maxHeight,
          background: '#fff',
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.20)',
          padding: 8,
          zIndex: 200,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        {CURRENCIES.map(c => {
          const active = c.code === currency.code
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => { setCurrency(c.code); setOpen(false) }}
              role="option"
              aria-selected={active}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: active ? 'rgba(208,120,80,0.08)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-urbanist), sans-serif',
                textAlign: 'left',
                transition: 'background 120ms',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 18 }}>{c.flag}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#1A1410' }}>
                  {c.code} <span style={{ color: '#A8998A', fontWeight: 400 }}>· {c.symbol}</span>
                </p>
                <p style={{ fontSize: 11, color: '#A8998A' }}>{c.name}</p>
              </div>
              {active && <Check size={14} color="#D07850" strokeWidth={3} />}
            </button>
          )
        })}
      </motion.div>
    </AnimatePresence>,
    document.body,
  ) : null

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: variant === 'compact' ? '8px 12px' : '12px 16px',
          borderRadius: 14,
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
          cursor: 'pointer',
          fontFamily: 'var(--font-urbanist), sans-serif',
          color: '#1A1410',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          transition: 'all 150ms ease',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
      >
        <span style={{ fontSize: variant === 'compact' ? 14 : 16 }}>{currency.flag}</span>
        <span style={{ fontWeight: 700, fontSize: variant === 'compact' ? 12 : 14 }}>
          {currency.code}
        </span>
        <ChevronDown
          size={variant === 'compact' ? 12 : 14}
          color="#65574A"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}
        />
      </button>
      {panel}
    </div>
  )
}
