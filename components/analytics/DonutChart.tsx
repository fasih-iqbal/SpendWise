'use client'
import { motion } from 'framer-motion'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { useCurrency } from '@/lib/currency'

interface Props {
  onlineSpend: number
  offlineSpend: number
  availableLimit: number
  changePct: number
  title?: string
  period?: string
}

const SEGMENT_COLORS = {
  online: '#2C6A49',
  offline: '#C9A830',
  available: '#7F5EA8',
}

export function DonutChart({
  onlineSpend,
  offlineSpend,
  availableLimit,
  changePct,
  title = 'My Expenses',
  period = 'This month',
}: Props) {
  const { format } = useCurrency()
  const total = onlineSpend + offlineSpend + availableLimit
  const pctOnline = total ? onlineSpend / total : 0
  const pctOffline = total ? offlineSpend / total : 0
  const pctAvail = total ? availableLimit / total : 0

  const size = 200
  const strokeWidth = 22
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const gap = 0.012 * circ // small gap between segments

  let cum = 0
  const segments: Array<{ pct: number; color: string; key: string }> = [
    { pct: pctOnline,  color: SEGMENT_COLORS.online,    key: 'online' },
    { pct: pctOffline, color: SEGMENT_COLORS.offline,   key: 'offline' },
    { pct: pctAvail,   color: SEGMENT_COLORS.available, key: 'available' },
  ]

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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 10px' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#F2EDE6"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg, i) => {
              const dash = Math.max(seg.pct * circ - gap, 0)
              const offset = cum
              cum += seg.pct * circ
              return (
                <motion.circle
                  key={seg.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ - dash}`}
                  initial={{ strokeDashoffset: -offset, opacity: 0 }}
                  animate={{ strokeDashoffset: -offset, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                />
              )
            })}
          </svg>

          {/* Center text */}
          <div
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
            <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 4 }}>Online Spend</p>
            <p style={{ fontWeight: 800, fontSize: 22, color: '#1A1410', lineHeight: 1 }}>
              {format(onlineSpend, { decimals: 2 })}
            </p>
            <div
              style={{
                marginTop: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                background: '#D8E8DE',
                color: '#2C6A49',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <TrendingUp size={10} strokeWidth={2.5} />
              +{changePct}%
            </div>
          </div>
        </div>
      </div>

      {/* Legend bar */}
      <div
        style={{
          background: '#1A1410',
          borderRadius: 14,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <LegendItem color={SEGMENT_COLORS.online}    label="Online Spend" />
        <LegendItem color={SEGMENT_COLORS.offline}   label="Offline Spend" />
        <LegendItem color={SEGMENT_COLORS.available} label="Available limit" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}
