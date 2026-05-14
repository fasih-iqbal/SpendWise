'use client'
import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'

interface Stat {
  emoji: string
  color: string
  label: string
  value: number
  prefix?: string
  suffix?: string
}

interface Props {
  income: number
  saved: number
  percentUsed: number
}

export function QuickStats({ income, saved, percentUsed }: Props) {
  const stats: Stat[] = [
    { emoji: '💰', color: '#2C6A49', label: 'Income',  value: income,      prefix: '$' },
    { emoji: '🏦', color: '#C9A830', label: 'Saved',   value: saved,       prefix: '$' },
    { emoji: '📊', color: '#D07850', label: 'Used',    value: percentUsed, suffix: '%' },
  ]

  return (
    <div style={{ margin: '0 20px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 20,
            padding: '14px 12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* Accent bottom line */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: stat.color }} />

          {/* Icon circle */}
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginBottom: 8 }}>
            {stat.emoji}
          </div>

          <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1410', marginBottom: 2 }}>
            {stat.prefix}<CountUp to={stat.value} />{stat.suffix ?? ''}
          </p>
          <p style={{ fontSize: 10, color: '#A8998A' }}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
