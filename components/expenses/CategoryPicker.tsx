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
      <p style={{ fontWeight: 600, fontSize: 13, color: '#65574A', marginBottom: 12, paddingLeft: 4 }}>
        Category
      </p>
      {categories.length === 0 && (
        <p style={{ fontSize: 12, color: '#A8998A', textAlign: 'center', padding: '8px 0' }}>
          No categories yet. Add one from Profile → Categories.
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          paddingBottom: 4,
        }}
      >
        {categories.map(cat => {
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: isSelected ? `${cat.color}22` : '#fff',
                  border: isSelected ? `2px solid ${cat.color}` : '2px solid rgba(0,0,0,0.08)',
                  boxShadow: isSelected ? `0 0 12px ${cat.color}40` : 'none',
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
                  fontSize: 10,
                  color: isSelected ? cat.color : '#A8998A',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
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
