'use client'
import { motion } from 'framer-motion'
import type { Goal } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  goals: Goal[]
}

export function GoalsCard({ goals }: Props) {
  if (goals.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="No goals set"
        subtitle="Set a savings goal to start working toward it."
      />
    )
  }

  return (
    <div
      className="mx-5 mb-5"
      style={{
        background: 'linear-gradient(145deg, rgba(251,191,36,0.08) 0%, rgba(26,32,53,1) 100%)',
        border: '1px solid rgba(251,191,36,0.15)',
        borderRadius: 24,
        padding: 20,
      }}
    >
      <p
        className="mb-4"
        style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14, color: 'rgb(var(--text-1))' }}
      >
        Savings Goals
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {goals.map((goal, i) => {
          const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100))
          return (
            <div key={goal.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{goal.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 13, color: 'rgb(var(--text-1))' }}>
                    {goal.name}
                  </p>
                </div>
                <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 13, color: '#FBBF24' }}>
                  ${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </p>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: 'rgba(var(--dim))', overflow: 'hidden' }}>
                <motion.div
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
