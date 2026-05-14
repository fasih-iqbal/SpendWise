'use client'
import { useState } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
}

export function CategoryScroll({ categories }: Props) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="mb-5">
      <p
        className="px-5 mb-3"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 600,
          fontSize: 14,
          color: 'rgb(var(--text-1))',
        }}
      >
        Categories
      </p>
      <div
        className="flex gap-3 px-5 overflow-x-auto scrollbar-none"
        style={{ paddingBottom: 4 }}
      >
        {categories.map(cat => {
          const isActive = active === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActive(isActive ? null : cat.id)}
              style={{
                minWidth: 76,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '10px 8px',
                borderRadius: 18,
                background: isActive ? `${cat.color}1A` : 'rgb(var(--bg-card))',
                border: isActive ? `1px solid ${cat.color}` : '1px solid rgba(var(--border), 0.06)',
                boxShadow: isActive ? `0 0 12px ${cat.color}40` : 'none',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 20 }}>{cat.emoji}</span>
              <span
                style={{
                  fontFamily: 'var(--font-dm)',
                  fontSize: 10,
                  color: isActive ? cat.color : 'rgb(var(--text-3))',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
