'use client'

interface Props {
  name: string
  email: string
  avatarUrl?: string
}

export function ProfileHeader({ name, email, avatarUrl }: Props) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div
      style={{
        margin: '0 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        borderRadius: 22,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D07850, #C9A830)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(208,120,80,0.2)',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontWeight: 800, fontSize: 22, color: '#fff' }}>{initials}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 17, color: '#1A1410', letterSpacing: '-0.01em' }}>
          {name}
        </p>
        <p style={{ fontSize: 12, color: '#A8998A' }}>{email}</p>
      </div>
    </div>
  )
}
