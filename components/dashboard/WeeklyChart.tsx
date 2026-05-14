'use client'
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { WeeklyData } from '@/lib/types'

interface Props {
  data: WeeklyData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'rgb(var(--bg-elevated))',
        border: '1px solid rgba(var(--border), 0.08)',
        borderRadius: 12,
        padding: '8px 12px',
      }}
    >
      <p style={{ fontFamily: 'var(--font-dm)', fontSize: 11, color: 'rgb(var(--text-3))', marginBottom: 2 }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 14, color: 'rgb(var(--text-1))' }}>
        ${payload[0].value}
      </p>
    </div>
  )
}

export function WeeklyChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.amount))

  return (
    <div className="mx-5 mb-5">
      <p
        className="mb-4"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 600,
          fontSize: 14,
          color: 'rgb(var(--text-1))',
        }}
      >
        This Week
      </p>
      <div
        style={{
          background: 'rgb(var(--bg-card))',
          border: '1px solid rgba(var(--border), 0.06)',
          borderRadius: 20,
          padding: '20px 16px 12px',
        }}
      >
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} barSize={28} barCategoryGap="25%">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B6EF5" />
                <stop offset="100%" stopColor="#5B6EF540" />
              </linearGradient>
              <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#2DD4BF40" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontFamily: 'var(--font-dm)',
                fontSize: 9,
                fill: 'rgb(107,122,159)',
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.amount === max ? 'url(#barGradCyan)' : 'url(#barGrad)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
