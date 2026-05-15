'use client'

interface Props {
  title: string
}

export function AnalyticsHeader({ title }: Props) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 20px 14px',
        background: '#EDE4D8',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#1A1410',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h1>
    </header>
  )
}
