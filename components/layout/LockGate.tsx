'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/lib/user-context'
import { hasPin, isUnlocked } from '@/lib/pin'

export function LockGate() {
  const { user, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) return
    if (pathname?.startsWith('/pin')) return
    if (!hasPin(user.id)) { router.replace('/pin?mode=set'); return }
    if (!isUnlocked(user.id)) router.replace('/pin')
  }, [user, loading, pathname, router])

  return null
}
