'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { CURRENCIES, useCurrency } from '@/lib/currency'

interface Props {
  variant?: 'compact' | 'full'
  align?: 'left' | 'right'
}

const SAFE_GAP = 16          // breathing room above safe-area / next button
const PREFERRED_MAX = 340    // ideal dropdown height when there is room

export function CurrencyPicker({ variant = 'compact', align = 'right' }: Props) {
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const [direction, setDirection] = useState<'down' | 'up'>('down')
  const [maxHeight, setMaxHeight] = useState(PREFERRED_MAX)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Decide whether to drop down or up based on available viewport room.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const recompute = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const vh = window.innerHeight
      const below = vh - rect.bottom - SAFE_GAP
      const above = rect.top - SAFE_GAP
      if (below >= 220 || below >= above) {
        setDirection('down')
        setMaxHeight(Math.max(180, Math.min(PREFERRED_MAX, below)))
      } else {
        setDirection('up')
        setMaxHeight(Math.max(180, Math.min(PREFERRED_MAX, above)))
      }
    }
    recompute()
    window.addEventListener('resize', recompute)
    window.addEventListener('scroll', recompute, true)
    return () => {
      window.removeEventListener('resize', recompute)
      window.removeEventListener('scroll', recompute, true)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'down' ? -8 : 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'down' ? -8 : 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="listbox"
            style={{
              position: 'absolute',
              ...(direction === 'down'
                ? { top: 'calc(100% + 8px)' }
                : { bottom: 'calc(100% + 8px)' }),
              [align]: 0,
              minWidth: 220,
              background: '#fff',
              borderRadius: 18,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
              padding: 8,
              zIndex: 100,
              maxHeight,
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
                    fontFamily: 'inherit',
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
        )}
      </AnimatePresence>
    </div>
  )
}
