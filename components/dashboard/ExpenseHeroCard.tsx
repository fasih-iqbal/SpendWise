'use client'
import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'
import { ProgressRing } from '@/components/ui/ProgressRing'
import type { DashboardStats } from '@/lib/types'

interface Props {
  stats: DashboardStats
  month: string
}

export function ExpenseHeroCard({ stats, month }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-5 mb-5 relative overflow-hidden"
      style={{
        borderRadius: 28,
        background: 'linear-gradient(145deg, #131d35 0%, #0f1525 60%, #0a0f1e 100%)',
        border: '1px solid rgba(91,110,245,0.2)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.5)',
        padding: 24,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 85% 15%, rgba(91,110,245,0.2) 0%, transparent 55%)',
        }}
      />

      {/* Bottom gradient border */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 2,
          background: 'linear-gradient(90deg, #5B6EF5, #2DD4BF)',
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-5 relative">
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgb(var(--text-3))',
          }}
        >
          Monthly Budget
        </span>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: 11,
            color: '#5B6EF5',
            background: 'rgba(91,110,245,0.15)',
            border: '1px solid rgba(91,110,245,0.35)',
            borderRadius: 999,
            padding: '4px 12px',
          }}
        >
          {month}
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-6 relative">
        <ProgressRing percentage={stats.percentUsed} size={110} strokeWidth={10} />

        <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Total Budget */}
          <div>
            <p style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgb(var(--text-3))', marginBottom: 2 }}>
              Total Budget
            </p>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 20, color: 'rgb(var(--text-1))' }}>
              $<CountUp to={stats.totalBudget} />
              <span style={{ fontFamily: 'var(--font-dm)', fontWeight: 400, fontSize: 12, color: 'rgb(var(--text-3))' }}>
                {' '}/ mo
              </span>
            </p>
          </div>

          {/* Spent */}
          <div>
            <p style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgb(var(--text-3))', marginBottom: 2 }}>
              Spent
            </p>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: 'rgb(var(--text-1))', marginBottom: 6 }}>
              $<CountUp to={stats.totalSpent} />
            </p>
            <div style={{ height: 4, borderRadius: 999, overflow: 'hidden', background: 'rgba(42,51,80,1)' }}>
              <motion.div
                style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #5B6EF5, #2DD4BF)' }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentUsed}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
          </div>

          {/* Remaining */}
          <div>
            <p style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgb(var(--text-3))', marginBottom: 2 }}>
              Remaining
            </p>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 20, color: '#34D399' }}>
              $<CountUp to={stats.totalRemaining} />
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
