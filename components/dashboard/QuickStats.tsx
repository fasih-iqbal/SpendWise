'use client'
import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'

interface Stat {
  emoji: string
  color: string
  label: string
  value: number
  prefix?: string
}

interface Props {
  income: number
  saved: number
  percentUsed: number
}

export function QuickStats({ income, saved, percentUsed }: Props) {
  const stats: Stat[] = [
    { emoji: '💰', color: '#34D399', label: 'Income',  value: income,      prefix: '$' },
    { emoji: '🏦', color: '#5B6EF5', label: 'Saved',   value: saved,       prefix: '$' },
    { emoji: '📊', color: '#F472B6', label: 'Used',     value: percentUsed, prefix: '' },
  ]

  return (
    <div className="mx-5 mb-5 grid grid-cols-3 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
          style={{
            background: 'rgb(var(--bg-card))',
            border: '1px solid rgba(var(--border), 0.06)',
            borderRadius: 20,
            padding: '14px 12px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Accent bottom line */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: stat.color,
            }}
          />

          {/* Icon circle */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: `${stat.color}26`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            {stat.emoji}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 15,
              color: 'rgb(var(--text-1))',
              marginBottom: 2,
            }}
          >
            {stat.prefix}<CountUp to={stat.value} />{stat.label === 'Used' ? '%' : ''}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dm)',
              fontSize: 10,
              color: 'rgb(var(--text-3))',
            }}
          >
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
