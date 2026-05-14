'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MoreVertical } from 'lucide-react'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'

interface Props {
  title: string
}

export function AnalyticsHeader({ title }: Props) {
  const router = useRouter()

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
      <button
        type="button"
        onClick={() => router.back()}
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
        aria-label="Back"
      >
        <ChevronLeft size={20} color="#1A1410" />
      </button>

      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 700,
          color: '#1A1410',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h1>

      <CurrencyPicker variant="compact" align="right" />

      <button
        type="button"
        aria-label="More"
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <MoreVertical size={20} color="#1A1410" />
      </button>
    </header>
  )
}
