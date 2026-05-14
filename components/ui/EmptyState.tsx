interface Props {
  icon: string
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <span style={{ fontSize: 56 }}>{icon}</span>
      <h3
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 700,
          fontSize: 18,
          color: 'rgb(var(--text-1))',
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-dm)',
          fontSize: 14,
          color: 'rgb(var(--text-3))',
          maxWidth: 260,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 20,
            padding: '10px 24px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
            color: '#fff',
            fontFamily: 'var(--font-syne)',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
