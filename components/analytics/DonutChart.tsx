'use client'
import { motion } from 'framer-motion'
import type { Category, Expense } from '@/lib/types'

interface Props {
  expenses: Expense[]
  categories: Category[]
}

export function DonutChart({ expenses, categories }: Props) {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  // Aggregate by category
  const totals: Record<string, number> = {}
  for (const e of expenses) {
    totals[e.category_id] = (totals[e.category_id] ?? 0) + e.amount
  }

  const grand = Object.values(totals).reduce((a, b) => a + b, 0)
  const segments = Object.entries(totals)
    .map(([id, amount]) => ({
      cat: catMap[id],
      amount,
      pct: grand ? amount / grand : 0,
    }))
    .filter(s => s.cat)
    .sort((a, b) => b.amount - a.amount)

  const size = 130
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius

  let cumOffset = 0

  return (
    <div
      className="mx-5 mb-5"
      style={{
        background: 'rgb(var(--bg-card))',
        border: '1px solid rgba(var(--border), 0.06)',
        borderRadius: 24,
        padding: 20,
      }}
    >
      <p
        className="mb-4"
        style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14, color: 'rgb(var(--text-1))' }}
      >
        Spending by Category
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {segments.map((seg, i) => {
              const dashArr = seg.pct * circ
              const dashOff = circ - dashArr
              const segOffset = cumOffset
              cumOffset += dashArr
              return (
                <motion.circle
                  key={seg.cat.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.cat.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashArr} ${circ - dashArr}`}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: circ - segOffset }}
                  transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  strokeLinecap="butt"
                />
              )
            })}
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 18, color: 'rgb(var(--text-1))' }}>
              ${Math.round(grand)}
            </span>
            <span style={{ fontFamily: 'var(--font-dm)', fontSize: 9, color: 'rgb(var(--text-3))' }}>total</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {segments.slice(0, 5).map(seg => (
            <div key={seg.cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: seg.cat.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgb(var(--text-2))', flex: 1 }}>
                {seg.cat.name}
              </span>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 11, color: 'rgb(var(--text-1))' }}>
                {Math.round(seg.pct * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
