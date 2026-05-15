'use client'
import { useEffect, useRef, useState } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  selected: string | null
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasMore, setHasMore] = useState(false)

  // Show fade hint when more categories live below the visible area.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setHasMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', update); ro.disconnect() }
  }, [categories.length])

  return (
    <div>
      <p style={{ fontWeight: 600, fontSize: 13, color: '#65574A', marginBottom: 10, paddingLeft: 4 }}>
        Category
      </p>
      {categories.length === 0 && (
        <p style={{ fontSize: 12, color: '#A8998A', textAlign: 'center', padding: '8px 0' }}>
          No categories yet. Add one from Profile → Categories.
        </p>
      )}
      <div style={{ position: 'relative' }}>
        <div
          ref={scrollRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            /* Two rows fit cleanly; remaining categories scroll inside this box. */
            maxHeight: 188,
            overflowY: 'auto',
            paddingBottom: hasMore ? 18 : 4,
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'thin',
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
                  gap: 4,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: isSelected ? `${cat.color}22` : '#fff',
                    border: isSelected ? `2px solid ${cat.color}` : '2px solid rgba(0,0,0,0.08)',
                    boxShadow: isSelected ? `0 0 12px ${cat.color}40` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 19,
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
        {/* Fade-out gradient at the bottom — UX hint that more categories exist below */}
        {hasMore && (
          <div
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 24,
              background: 'linear-gradient(180deg, rgba(245,239,232,0) 0%, rgba(245,239,232,0.95) 100%)',
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}
          />
        )}
      </div>
    </div>
  )
}
