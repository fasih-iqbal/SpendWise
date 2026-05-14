'use client'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'
import { getGreeting, getGreetingEmoji } from '@/lib/utils'

interface Props {
  userName?: string
  avatarUrl?: string
}

export function Header({ userName = 'there', avatarUrl }: Props) {
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 14px',
        background: '#EDE4D8',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, color: '#A8998A', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{getGreetingEmoji()}</span>
          <span>{getGreeting()}</span>
        </p>
        <h1
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: '#1A1410',
            letterSpacing: '-0.01em',
          }}
        >
          Welcome, <span style={{ fontWeight: 800 }}>{userName}</span>
        </h1>
      </div>

      <CurrencyPicker variant="compact" align="right" />

      <button
        type="button"
        aria-label="Profile"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D07850, #C9A830)',
          border: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{initials}</span>
        )}
      </button>
    </header>
  )
}
