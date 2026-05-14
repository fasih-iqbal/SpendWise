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
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ fontSize: 11, color: '#A8998A', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1410' }}>${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export function MonthComparison({ data }: Props) {
  const latest = data[data.length - 1]

  return (
    <div
      style={{
        margin: '0 20px 16px',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410', marginBottom: 16 }}>
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
            tick={{ fontSize: 11, fill: '#A8998A' }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <Bar dataKey="amount" radius={[0, 8, 8, 0]} animationBegin={0} animationDuration={800}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.month === latest.month ? '#2C6A49' : 'rgba(44,106,73,0.3)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
