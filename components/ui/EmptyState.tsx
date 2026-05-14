interface Props {
  icon: string
  title: string
  subtitle: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, subtitle, action }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 32px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 52 }}>{icon}</span>
      <h3
        style={{
          fontWeight: 700,
          fontSize: 17,
          color: '#1A1410',
          marginTop: 14,
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 13, color: '#A8998A', maxWidth: 260, lineHeight: 1.5 }}>
        {subtitle}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            marginTop: 18,
            padding: '12px 28px',
            borderRadius: 14,
            background: '#D07850',
            color: '#fff',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(208,120,80,0.3)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
