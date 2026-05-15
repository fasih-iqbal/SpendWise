'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { SpendingCategory } from '@/lib/types'

interface Props {
  categories: SpendingCategory[]
  onCreateNew?: () => void
}

export function SpendingGoalScroll({ categories, onCreateNew }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ padding: '0 20px', fontWeight: 700, fontSize: 15, color: '#1A1410', marginBottom: 14 }}>
        Your Spending Goal
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          padding: '0 20px 6px',
        }}
      >
        {/* Create new */}
        <button
          type="button"
          onClick={onCreateNew}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            minWidth: 0,
          }}
          aria-label="Create new spending goal"
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: '#1A1410',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <Plus size={20} color="#D07850" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 10, color: '#D07850', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Create New
          </span>
        </button>

        {categories.map((cat, i) => {
          const isActive = selected === cat.id
          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => setSelected(isActive ? null : cat.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.94 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#fff',
                  border: isActive ? `2px solid ${cat.color}` : '1px solid rgba(0,0,0,0.08)',
                  boxShadow: isActive
                    ? `0 0 0 4px ${cat.color}22`
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  transition: 'all 180ms ease',
                }}
              >
                {cat.emoji}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: isActive ? cat.color : '#65574A',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {cat.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
