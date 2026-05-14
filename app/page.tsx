'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const decide = async () => {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (cancelled) return
      if (user) { router.replace('/pin'); return }
      const seen = typeof window !== 'undefined' && localStorage.getItem('spendwise-onboarded') === '1'
      router.replace(seen ? '/auth' : '/onboarding')
    }
    decide()
    return () => { cancelled = true }
  }, [router])

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#EDE4D8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '3px solid rgba(208,120,80,0.25)',
          borderTopColor: '#D07850',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
