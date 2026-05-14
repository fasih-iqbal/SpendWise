'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCurrency } from '@/lib/currency'
import type { WeeklyData } from '@/lib/types'

interface Props {
  data: WeeklyData[]
}

const HEIGHT = 130
const PADDING = { top: 20, bottom: 28, left: 8, right: 8 }

export function WeeklyChart({ data }: Props) {
  const { format } = useCurrency()
  const [selected, setSelected] = useState<number>(3) // wed default

  if (data.length === 0) return null

  const max = Math.max(...data.map(d => d.amount)) * 1.15
  const min = 0
  const innerH = HEIGHT - PADDING.top - PADDING.bottom

  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(320)
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width
      if (w && w > 0) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const innerW = width - PADDING.left - PADDING.right
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0

  const points = data.map((d, i) => ({
    x: PADDING.left + i * stepX,
    y: PADDING.top + innerH - ((d.amount - min) / (max - min)) * innerH,
    val: d.amount,
    day: d.day,
    date: d.date,
  }))

  // Smooth cubic Bezier path
  const path = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = arr[i - 1]
    const cx1 = prev.x + (p.x - prev.x) / 2
    const cy1 = prev.y
    const cx2 = prev.x + (p.x - prev.x) / 2
    const cy2 = p.y
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`
  }, '')

  const areaPath = `${path} L ${points[points.length - 1].x} ${PADDING.top + innerH} L ${points[0].x} ${PADDING.top + innerH} Z`
  const sel = points[selected] ?? points[0]
  const formattedDate = new Date(sel.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: '#1A1410' }}>Analytics</p>
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
          Daily
          <ChevronDown size={12} color="#1A1410" />
        </button>
      </div>

      {/* Highlighted amount */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{ width: 30, height: 30, borderRadius: 10, background: '#D07850', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>$</span>
        </div>
        <p style={{ fontWeight: 700, fontSize: 18, color: '#D07850' }}>
          -{format(sel.val, { decimals: 2 })}
        </p>
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: HEIGHT }}
      >
        <svg width={width} height={HEIGHT} style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D07850" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#D07850" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2C6A49" />
              <stop offset="55%" stopColor="#D07850" />
              <stop offset="100%" stopColor="#C9A830" />
            </linearGradient>
          </defs>

          <motion.path
            d={areaPath}
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Vertical guide line at selected */}
          <line
            x1={sel.x}
            x2={sel.x}
            y1={PADDING.top - 8}
            y2={PADDING.top + innerH}
            stroke="rgba(0,0,0,0.12)"
            strokeDasharray="3 3"
            strokeWidth={1}
          />

          {/* Touch areas */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={p.x - stepX / 2}
              y={0}
              width={stepX}
              height={HEIGHT}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onClick={() => setSelected(i)}
              onMouseEnter={() => setSelected(i)}
            />
          ))}

          {/* Selected dot */}
          <circle cx={sel.x} cy={sel.y} r={7} fill="#fff" stroke="#D07850" strokeWidth={2.5} />
          <circle cx={sel.x} cy={sel.y} r={3} fill="#D07850" />

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="10"
              fill={i === selected ? '#D07850' : '#A8998A'}
              fontWeight={i === selected ? 700 : 400}
              fontFamily="var(--font-urbanist), sans-serif"
            >
              {p.day}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        <div
          style={{
            position: 'absolute',
            left: Math.min(Math.max(sel.x - 60, 0), width - 120),
            top: Math.max(sel.y - 56, 0),
            background: '#1A1410',
            color: '#fff',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: 11,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            minWidth: 110,
            textAlign: 'left',
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 1 }}>
            -{format(sel.val, { decimals: 2 })}
          </p>
          <p style={{ fontSize: 9, opacity: 0.7 }}>{formattedDate}</p>
        </div>
      </div>
    </div>
  )
}
