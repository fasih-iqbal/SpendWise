'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyData } from '@/lib/types'

interface Props {
  data: MonthlyData[]
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
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export function MonthComparison({ data }: Props) {
  const latest = data[data.length - 1]

  return (
    <div
      className="mx-5 mb-5"
      style={{
        background: 'rgb(var(--bg-card))',
        border: '1px solid rgba(var(--border), 0.06)',
        borderRadius: 24,
        padding: 20,
      }}
    >
      <p
        className="mb-4"
        style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: 14, color: 'rgb(var(--text-1))' }}
      >
        Month Comparison
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" barSize={20}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: 'var(--font-dm)', fontSize: 11, fill: 'rgb(107,122,159)' }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="amount" radius={[0, 8, 8, 0]} animationBegin={0} animationDuration={800}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.month === latest.month ? '#2DD4BF' : 'rgba(91,110,245,0.5)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
