'use client'
import { ChevronRight } from 'lucide-react'

interface SettingsItem {
  icon: string
  label: string
  value?: string
  onClick?: () => void
  danger?: boolean
}

interface Props {
  title: string
  items: SettingsItem[]
}

export function SettingsCard({ title, items }: Props) {
  return (
    <div style={{ margin: '0 20px 16px' }}>
      <p
        style={{
          padding: '0 4px 8px',
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#65574A',
        }}
      >
        {title}
      </p>
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              cursor: item.onClick ? 'pointer' : 'default',
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'background 120ms',
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 14,
                color: item.danger ? '#D03C3C' : '#1A1410',
                flex: 1,
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
            {item.value && (
              <span style={{ fontSize: 13, color: '#A8998A' }}>{item.value}</span>
            )}
            {item.onClick && <ChevronRight size={16} color="#A8998A" />}
          </button>
        ))}
      </div>
    </div>
  )
}
