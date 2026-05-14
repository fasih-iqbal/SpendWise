'use client'
import { motion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'
import { useCurrency } from '@/lib/currency'

interface Props {
  availableCredit: number
  cardLastFour: string
  cardHolder: string
  validThru: string
}

export function ExpenseHeroCard({ availableCredit, cardLastFour, cardHolder, validThru }: Props) {
  const { currency } = useCurrency()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        margin: '0 20px 20px',
        borderRadius: 24,
        background: 'linear-gradient(155deg, #1F1A17 0%, #0E0B09 100%)',
        padding: 22,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0,0,0,0.28)',
      }}
    >
      {/* Soft corner glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(208,120,80,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top row: label + contactless icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          Available Credit
        </p>
        {/* Contactless symbol */}
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 8a10 10 0 0 1 0 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 6a14 14 0 0 1 0 12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M13 4a18 18 0 0 1 0 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      {/* Amount */}
      <p
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 18,
        }}
      >
        {currency.symbol}<CountUp to={availableCredit} decimals={0} />
      </p>

      {/* Card number */}
      <p
        style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.18em',
          fontFamily: '"SF Mono", Consolas, monospace',
          marginBottom: 22,
          fontWeight: 500,
        }}
      >
        ∗∗∗∗ &nbsp;∗∗∗∗ &nbsp;∗∗∗∗ &nbsp;{cardLastFour}
      </p>

      {/* Bottom: holder, valid thru, brand */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 3 }}>
            Card Holder
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{cardHolder}</p>
        </div>
        <div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 3 }}>
            Valid Thru
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{validThru}</p>
        </div>
        {/* Brand: two overlapping circles */}
        <div style={{ display: 'flex' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#D07850' }} />
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2C6A49', marginLeft: -8, opacity: 0.95 }} />
        </div>
      </div>
    </motion.div>
  )
}
