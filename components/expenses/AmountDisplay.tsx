'use client'
import { useCurrency } from '@/lib/currency'

interface Props {
  amount: string
}

export function AmountDisplay({ amount }: Props) {
  const { currency } = useCurrency()
  const [intPart, decPart] = amount.includes('.') ? amount.split('.') : [amount, null]

  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontWeight: 800, fontSize: 28, color: '#D07850', paddingTop: 12 }}>{currency.symbol}</span>
        <span style={{ fontWeight: 800, fontSize: 64, color: '#1A1410', lineHeight: 1 }}>
          {intPart || '0'}
        </span>
        {decPart !== null && (
          <span style={{ fontWeight: 700, fontSize: 28, color: '#65574A', paddingTop: 12 }}>
            .{decPart}
          </span>
        )}
        <span
          className="cursor-blink"
          style={{ display: 'inline-block', width: 3, height: 52, background: '#D07850', borderRadius: 2, marginLeft: 4, alignSelf: 'center' }}
        />
      </div>
    </div>
  )
}
