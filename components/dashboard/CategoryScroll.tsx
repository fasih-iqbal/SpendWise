'use client'
import { useState } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
}

export function CategoryScroll({ categories }: Props) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ padding: '0 20px', marginBottom: 10, fontWeight: 600, fontSize: 14, color: '#1A1410' }}>
        Categories
      </p>
      <div
        className="scrollbar-none"
        style={{ display: 'flex', gap: 10, padding: '0 20px 4px', overflowX: 'auto' }}
      >
        {categories.map(cat => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(isActive ? null : cat.id)}
              style={{
                minWidth: 76,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 18,
                background: isActive ? `${cat.color}18` : '#fff',
                border: isActive ? `1.5px solid ${cat.color}` : '1px solid rgba(0,0,0,0.07)',
                boxShadow: isActive ? `0 0 12px ${cat.color}30` : '0 2px 6px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20 }}>{cat.emoji}</span>
              <span style={{ fontSize: 10, color: isActive ? cat.color : '#A8998A', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400 }}>
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
