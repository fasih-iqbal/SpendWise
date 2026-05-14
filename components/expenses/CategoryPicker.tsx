'use client'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  selected: string | null
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 600,
          fontSize: 13,
          color: 'rgb(var(--text-2))',
          marginBottom: 12,
          paddingLeft: 4,
        }}
      >
        Category
      </p>
      <div className="flex gap-3 overflow-x-auto scrollbar-none" style={{ paddingBottom: 4 }}>
        {categories.map(cat => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                width: 60,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: isSelected ? `${cat.color}26` : 'rgb(var(--bg-card))',
                  border: isSelected ? `2px solid ${cat.color}` : '2px solid rgba(var(--border), 0.08)',
                  boxShadow: isSelected ? `0 0 12px ${cat.color}50` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  transition: 'all 150ms ease',
                }}
              >
                {cat.emoji}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-dm)',
                  fontSize: 10,
                  color: isSelected ? cat.color : 'rgb(var(--text-3))',
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
