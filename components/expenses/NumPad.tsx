'use client'
import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'

interface Props {
  onKey: (key: string) => void
}

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

export function NumPad({ onKey }: Props) {
  const handleKey = (key: string) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    onKey(key)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {KEYS.map(key => (
        <motion.button
          key={key}
          type="button"
          onTap={() => handleKey(key)}
          whileTap={{ scale: 0.96, backgroundColor: 'rgba(208,120,80,0.12)' }}
          style={{
            height: 'clamp(42px, 7.5dvh, 54px)',
            borderRadius: 14,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-urbanist), sans-serif',
            fontWeight: 600,
            fontSize: 18,
            color: key === '⌫' ? '#D07850' : '#1A1410',
            transition: 'background 100ms ease',
          }}
        >
          {key === '⌫' ? <Delete size={18} /> : key}
        </motion.button>
      ))}
    </div>
  )
}
