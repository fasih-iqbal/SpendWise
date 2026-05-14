'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STORAGE_KEY = 'spendwise-insight-dismissed'

export function InsightBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const d = sessionStorage.getItem(STORAGE_KEY)
    setDismissed(!!d)
  }, [])

  if (dismissed) return null

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setDismissed(true)
  }

  return (
    <div
      className="mx-5 mb-5 flex items-start gap-3 rounded-card p-4 relative"
      style={{
        background: 'rgba(45,212,191,0.08)',
        border: '1px solid rgba(45,212,191,0.2)',
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
      <p style={{ fontFamily: 'var(--font-dm)', fontSize: 13, color: 'rgb(var(--text-2))', lineHeight: 1.5 }}>
        You&apos;ve spent{' '}
        <strong style={{ color: '#2DD4BF' }}>63% of your budget</strong>{' '}
        with 17 days left this month. Consider reducing{' '}
        <strong style={{ color: '#2DD4BF' }}>Entertainment</strong> spending.
      </p>
      <button
        onClick={dismiss}
        style={{ flexShrink: 0, color: 'rgb(var(--text-3))', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}
