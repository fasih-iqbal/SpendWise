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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {KEYS.map(key => (
        <motion.button
          key={key}
          onTap={() => handleKey(key)}
          whileTap={{ scale: 0.96, backgroundColor: 'rgba(91,110,245,0.2)' }}
          style={{
            height: 56,
            borderRadius: 16,
            background: 'rgb(var(--bg-card))',
            border: '1px solid rgba(var(--border), 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: 18,
            color: key === '⌫' ? 'rgb(var(--danger))' : 'rgb(var(--text-1))',
            transition: 'background 100ms ease',
          }}
        >
          {key === '⌫' ? <Delete size={18} /> : key}
        </motion.button>
      ))}
    </div>
  )
}
