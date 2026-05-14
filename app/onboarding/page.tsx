'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronsRight } from 'lucide-react'
import { SketchGrid } from '@/components/onboarding/SketchGrid'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'

const SCREENS = [
  {
    title: 'Manage your\nExpenses Easily',
    subtitle:
      'Get a full view so you know where to save. Track spending, detect fraud, and keep tabs on rising subscription costs.',
  },
  {
    title: 'Plan Smarter\nLive Better',
    subtitle:
      'Set goals, monitor categories, and watch your savings grow month over month with intelligent insights.',
  },
  {
    title: 'Pick Your\nCurrency',
    subtitle:
      'Choose the currency you spend in every day. You can change it anytime from your profile settings.',
  },
]

export default function OnboardingPage() {
  const [screen, setScreen] = useState(0)
  const router = useRouter()

  const next = () => {
    if (screen < SCREENS.length - 1) setScreen(s => s + 1)
    else router.push('/auth')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#EDE4D8',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-urbanist), sans-serif',
        maxWidth: 430,
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      {/* Skip */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 18 }}>
        <button
          type="button"
          onClick={() => router.push('/auth')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 13,
            color: '#A8998A',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 8,
          }}
        >
          Skip
        </button>
      </div>

      {/* Sketch panel */}
      <div style={{ paddingTop: 12 }}>
        <SketchGrid />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: 30, flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: '#1A1410',
              lineHeight: 1.15,
              marginBottom: 12,
              whiteSpace: 'pre-line',
              letterSpacing: '-0.01em',
            }}
          >
            {SCREENS[screen].title}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: '#65574A',
              lineHeight: 1.55,
              maxWidth: 340,
            }}
          >
            {SCREENS[screen].subtitle}
          </p>

          {screen === 2 && (
            <div style={{ marginTop: 18 }}>
              <CurrencyPicker variant="full" align="left" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
        {SCREENS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === screen ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: i === screen ? '#D07850' : 'rgba(0,0,0,0.15)',
              transition: 'all 300ms',
            }}
          />
        ))}
      </div>

      {/* Swipe button */}
      <div style={{ paddingBottom: 40 }}>
        <motion.button
          type="button"
          onClick={next}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: 'none',
            borderRadius: 999,
            padding: '6px 24px 6px 6px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: '#1A1410',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChevronsRight size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1A1410' }}>
            {screen === SCREENS.length - 1 ? 'Get Started' : 'Swipe to get started'}
          </span>
        </motion.button>
      </div>
    </div>
  )
}
