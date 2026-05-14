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
      style={{
        margin: '0 20px 20px',
        background: '#fff',
        border: '1px solid rgba(201,168,48,0.2)',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410', marginBottom: 16 }}>
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
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#1A1410' }}>{goal.name}</p>
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#C9A830' }}>
                  ${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </p>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: '#EDE4D8', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #C9A830, #D07850)' }}
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
