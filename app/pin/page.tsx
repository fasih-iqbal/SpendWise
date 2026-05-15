'use client'
import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Delete } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { hasPin, setPin, verifyPin, markUnlocked } from '@/lib/pin'

type Mode = 'set' | 'confirm' | 'unlock'

function PinScreen() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, loading } = useUser()
  const forceSet = params.get('mode') === 'set'

  const [mode, setMode] = useState<Mode>('unlock')
  const [pin, setPinValue] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [working, setWorking] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/auth'); return }
    if (forceSet || !hasPin(user.id)) setMode('set')
    else setMode('unlock')
  }, [user, loading, forceSet, router])

  useEffect(() => {
    if (pin.length < 4) return
    void handleComplete()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])

  const triggerError = (msg: string) => {
    setError(msg)
    setShake(true)
    setPinValue('')
    setTimeout(() => setShake(false), 380)
  }

  const handleComplete = async () => {
    if (!user) return
    setWorking(true)
    try {
      if (mode === 'set') {
        setFirstPin(pin)
        setPinValue('')
        setMode('confirm')
        setError('')
      } else if (mode === 'confirm') {
        if (pin !== firstPin) {
          triggerError('PINs do not match. Try again.')
          setFirstPin('')
          setMode('set')
          return
        }
        await setPin(user.id, pin)
        router.replace('/dashboard')
      } else {
        const ok = await verifyPin(user.id, pin)
        if (!ok) { triggerError('Wrong PIN'); return }
        markUnlocked(user.id)
        router.replace('/dashboard')
      }
    } finally {
      setWorking(false)
    }
  }

  const onKey = (k: string) => {
    if (working) return
    setError('')
    if (k === '<') { setPinValue(p => p.slice(0, -1)); return }
    if (pin.length >= 4) return
    setPinValue(p => p + k)
  }

  const heading =
    mode === 'set' ? 'Create your PIN'
    : mode === 'confirm' ? 'Confirm your PIN'
    : 'Enter your PIN'
  const subtitle =
    mode === 'set' ? "We'll ask for this 4-digit PIN every time you open SpendWise."
    : mode === 'confirm' ? 'Re-enter the PIN to confirm.'
    : 'Welcome back. Enter your 4-digit PIN to continue.'

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#EDE4D8',
        fontFamily: 'var(--font-urbanist), sans-serif',
        display: 'flex',
        flexDirection: 'column',
        /* top padding respects notch, bottom padding respects home bar */
        paddingTop: 'max(24px, env(safe-area-inset-top))',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
        maxWidth: 430,
        margin: '0 auto',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <div
          style={{
            width: 76, height: 76, borderRadius: 22,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 28px rgba(0,0,0,0.10)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src="/icons/logo-192.png"
            alt="SpendWise"
            width={76}
            height={76}
            priority
            style={{ objectFit: 'cover', borderRadius: 22 }}
          />
        </div>

        <div style={{ textAlign: 'center', padding: '0 12px' }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#1A1410', marginBottom: 6 }}>{heading}</h1>
          <p style={{ fontSize: 13, color: '#65574A', lineHeight: 1.5, maxWidth: 280 }}>{subtitle}</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 12, color: '#D03C3C', fontWeight: 600 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          animate={shake ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', gap: 14, marginTop: 4 }}
        >
          {[0, 1, 2, 3].map(i => {
            const filled = i < pin.length
            return (
              <div
                key={i}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: filled ? '#1A1410' : 'transparent',
                  border: '2px solid #1A1410',
                  transition: 'background 120ms ease',
                }}
              />
            )
          })}
        </motion.div>
      </div>

      <NumPad onKey={onKey} disabled={working} />

      {/* Safe-area spacer — pushes numpad above home bar on iPhone */}
      <div style={{ height: 'max(20px, env(safe-area-inset-bottom))' }} />
    </div>
  )
}

function NumPad({ onKey, disabled }: { onKey: (k: string) => void; disabled?: boolean }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','<']
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        maxWidth: 320, width: '100%', margin: '0 auto',
      }}
    >
      {keys.map((k, i) => {
        if (k === '') return <div key={i} />
        const isBack = k === '<'
        return (
          <motion.button
            key={i}
            type="button"
            whileTap={{ scale: 0.94 }}
            disabled={disabled}
            onClick={() => {
              try { if (navigator.vibrate) navigator.vibrate(8) } catch {}
              onKey(k)
            }}
            style={{
              height: 58,
              borderRadius: 18,
              background: isBack ? 'transparent' : '#fff',
              border: isBack ? 'none' : '1px solid rgba(0,0,0,0.06)',
              color: '#1A1410',
              fontWeight: 700,
              fontSize: 22,
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isBack ? 'none' : '0 2px 6px rgba(0,0,0,0.05)',
            }}
            aria-label={isBack ? 'Backspace' : `Digit ${k}`}
          >
            {isBack ? <Delete size={22} color="#65574A" /> : k}
          </motion.button>
        )
      })}
    </div>
  )
}

export default function PinPage() {
  return (
    <Suspense>
      <PinScreen />
    </Suspense>
  )
}
