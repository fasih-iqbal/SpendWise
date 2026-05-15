'use client'
import { useState, useMemo } from 'react'
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

/** Raw expense data needed to filter by period */
export interface RawExpense {
  date: string
  amount: number
  category_id?: string
}

export interface CategoryDef {
  id: string
  name: string
  emoji?: string
  color: string
}

interface Props {
  /** Pre-computed slices (used when no rawExpenses provided) */
  slices?: DonutSlice[]
  total?: number
  changePct?: number
  title?: string
  period?: string
  /** Raw expenses + categories for live date-filter mode */
  rawExpenses?: RawExpense[]
  categories?: CategoryDef[]
}

type Period = 'Day' | 'Week' | 'Month' | 'Year'
const PERIODS: Period[] = ['Day', 'Week', 'Month', 'Year']

const SIZE = 200
const STROKE = 22
const RADIUS = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * RADIUS

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (period) {
    case 'Day':
      return { start: today, end: today }
    case 'Week': {
      const dow = today.getDay()
      const start = new Date(today)
      start.setDate(today.getDate() - dow)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return { start, end }
    }
    case 'Month':
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      }
    case 'Year':
      return {
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today.getFullYear(), 11, 31),
      }
  }
}

function buildSlices(
  expenses: RawExpense[],
  categories: CategoryDef[],
  period: Period,
): { slices: DonutSlice[]; total: number } {
  const { start, end } = getDateRange(period)
  const filtered = expenses.filter(e => {
    const d = new Date(e.date)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return day >= start && day <= end
  })
  const totals = new Map<string, number>()
  for (const e of filtered) {
    const key = e.category_id ?? 'uncat'
    totals.set(key, (totals.get(key) ?? 0) + Number(e.amount))
  }
  const items: DonutSlice[] = Array.from(totals.entries())
    .map(([id, value]) => {
      const cat = categories.find(c => c.id === id)
      return {
        key: id,
        label: cat?.name ?? 'Uncategorized',
        emoji: cat?.emoji,
        color: cat?.color ?? '#A8998A',
        value,
      }
    })
    .sort((a, b) => b.value - a.value)
  const total = items.reduce((s, x) => s + x.value, 0)
  return { slices: items, total }
}

export function DonutChart({
  slices: propSlices,
  total: propTotal = 0,
  changePct = 0,
  title = 'My Expenses',
  rawExpenses,
  categories = [],
}: Props) {
  const { format } = useCurrency()
  const [activePeriod, setActivePeriod] = useState<Period>('Month')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { slices, total } = useMemo(() => {
    if (rawExpenses) {
      return buildSlices(rawExpenses, categories, activePeriod)
    }
    return { slices: propSlices ?? [], total: propTotal }
  }, [rawExpenses, categories, activePeriod, propSlices, propTotal])

  const visible = slices.filter(s => s.value > 0)
  const positive = changePct >= 0

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

        {/* Period picker */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
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
            {activePeriod}
            <ChevronDown
              size={12}
              color="#1A1410"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: 14,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                zIndex: 50,
                minWidth: 100,
              }}
            >
              {PERIODS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setActivePeriod(p); setDropdownOpen(false) }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '9px 16px',
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: p === activePeriod ? 700 : 500,
                    color: p === activePeriod ? '#D07850' : '#1A1410',
                    background: p === activePeriod ? '#FBF6F0' : 'transparent',
                    border: 'none',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
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
                key={`${seg.key}-${activePeriod}`}
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
            key={activePeriod}
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
            {rawExpenses === undefined && (
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
            )}
            {rawExpenses !== undefined && (
              <p style={{ fontSize: 10, color: '#A8998A', marginTop: 4, fontWeight: 600 }}>
                {activePeriod === 'Day' ? 'Today' : `This ${activePeriod}`}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Legend */}
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
