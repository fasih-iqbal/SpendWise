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
      className="mx-5 mb-5 flex items-center gap-4 p-5 rounded-card"
      style={{
        background: 'linear-gradient(145deg, rgb(var(--bg-card)), rgb(var(--bg-elevated)))',
        border: '1px solid rgba(var(--border), 0.06)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 22, color: '#fff' }}>
            {initials}
          </span>
        )}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: 18, color: 'rgb(var(--text-1))' }}>
          {name}
        </p>
        <p style={{ fontFamily: 'var(--font-dm)', fontSize: 13, color: 'rgb(var(--text-3))' }}>
          {email}
        </p>
      </div>
    </div>
  )
}
