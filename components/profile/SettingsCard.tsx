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
    <div className="mx-5 mb-4">
      <p
        className="mb-2 px-1"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgb(var(--text-3))',
        }}
      >
        {title}
      </p>
      <div
        style={{
          background: 'rgb(var(--bg-card))',
          border: '1px solid rgba(var(--border), 0.06)',
          borderRadius: 20,
          overflow: 'hidden',
        }}
      >
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={item.onClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              background: 'none',
              border: 'none',
              borderTop: i > 0 ? '1px solid rgba(var(--border), 0.06)' : 'none',
              cursor: item.onClick ? 'pointer' : 'default',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            <span
              style={{
                fontFamily: 'var(--font-dm)',
                fontSize: 14,
                color: item.danger ? 'rgb(var(--danger))' : 'rgb(var(--text-1))',
                flex: 1,
              }}
            >
              {item.label}
            </span>
            {item.value && (
              <span style={{ fontFamily: 'var(--font-dm)', fontSize: 13, color: 'rgb(var(--text-3))' }}>
                {item.value}
              </span>
            )}
            {item.onClick && (
              <ChevronRight size={16} color="rgb(var(--text-3))" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
