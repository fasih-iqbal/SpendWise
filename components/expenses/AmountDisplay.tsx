'use client'

interface Props {
  amount: string
}

export function AmountDisplay({ amount }: Props) {
  const [intPart, decPart] = amount.includes('.') ? amount.split('.') : [amount, null]

  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 28,
            color: '#5B6EF5',
            paddingTop: 12,
          }}
        >
          $
        </span>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 64,
            color: 'rgb(var(--text-1))',
            lineHeight: 1,
          }}
        >
          {intPart || '0'}
        </span>
        {decPart !== null && (
          <span
            style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 28,
              color: 'rgb(var(--text-2))',
              paddingTop: 12,
            }}
          >
            .{decPart}
          </span>
        )}
        <span
          className="cursor-blink"
          style={{
            display: 'inline-block',
            width: 3,
            height: 52,
            background: '#5B6EF5',
            borderRadius: 2,
            marginLeft: 4,
            alignSelf: 'center',
          }}
        />
      </div>
    </div>
  )
}
