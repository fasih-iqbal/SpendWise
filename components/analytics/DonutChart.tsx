'use client'
import { motion } from 'framer-motion'
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import { useCurrency } from '@/lib/currency'

export interface DonutSlice {
  key: string
  label: string
  value: number
  color: string
  emoji?: string
}

interface Props {
  slices: DonutSlice[]
  total: number
  changePct?: number
  title?: string
  period?: string
}

const SIZE = 200
const STROKE = 22
const RADIUS = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS

export function DonutChart({
  slices,
  total,
  changePct = 0,
  title = 'My Expenses',
  period = 'This month',
}: Props) {
  const { format } = useCurrency()

  const visible = slices.filter(s => s.value > 0)
  const positive = changePct >= 0

  // Pre-compute segment dasharray + cumulative offset.
  const gap = visible.length > 1 ? Math.min(0.012 * CIRC, 6) : 0
  let cum = 0
  const segs = visible.map(s => {
    const pct = total > 0 ? s.value / total : 0
    const dash = Math.max(pct * CIRC - gap, 0)
    const offset = cum
    cum += pct * CIRC
    return { ...s, dash, offset, pct }
  })

  return (
    <div
      style={{
        margin: '0 20px 16px',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 22,
        padding: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1410' }}>{title}</p>
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'rgba(0,0,0,0.04)',
            border: 'none',
            borderRadius: 999,
            padding: '5px 12px',
            fontSize: 11,
            color: '#1A1410',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {period}
          <ChevronDown size={12} color="#1A1410" />
        </button>
      </div>

      {/* Donut */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 14px' }}>
        <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#F2EDE6"
              strokeWidth={STROKE}
            />
            {segs.map((seg, i) => (
              <motion.circle
                key={seg.key}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`0 ${CIRC}`}
                style={{ strokeDashoffset: -seg.offset }}
                animate={{ strokeDasharray: `${seg.dash} ${CIRC - seg.dash}` }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.08 + i * 0.05,
                }}
              />
            ))}
          </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 4 }}>Total Spent</p>
            <p style={{ fontWeight: 800, fontSize: 22, color: '#1A1410', lineHeight: 1 }}>
              {format(total, { decimals: 0 })}
            </p>
            <div
              style={{
                marginTop: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                background: positive ? '#FBE7D9' : '#D8E8DE',
                color: positive ? '#A85D3A' : '#2C6A49',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {positive ? <TrendingUp size={10} strokeWidth={2.5} /> : <TrendingDown size={10} strokeWidth={2.5} />}
              {positive ? '+' : ''}{changePct}%
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legend grid — wraps to prevent overlap */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 8,
        }}
      >
        {visible.length === 0 ? (
          <p style={{ fontSize: 12, color: '#A8998A', textAlign: 'center', gridColumn: '1 / -1', padding: '8px 0' }}>
            No spending this period.
          </p>
        ) : visible.map((s, i) => {
          const pct = total > 0 ? Math.round((s.value / total) * 100) : 0
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                background: '#F8F4EE',
                borderRadius: 10,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: s.color, flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: '#1A1410', fontWeight: 600, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.emoji ? `${s.emoji} ` : ''}{s.label}
              </span>
              <span style={{ fontSize: 11, color: '#65574A', fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
