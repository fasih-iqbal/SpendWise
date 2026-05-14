'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
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

const SWIPE_THRESHOLD = 60

function markOnboarded() {
  try { localStorage.setItem('spendwise-onboarded', '1') } catch {}
}

export default function OnboardingPage() {
  const [screen, setScreen] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const router = useRouter()

  const isLast = screen === SCREENS.length - 1

  const goNext = () => {
    if (!isLast) { setDir(1); setScreen(s => s + 1) }
    else { markOnboarded(); router.push('/auth') }
  }
  const goPrev = () => {
    if (screen > 0) { setDir(-1); setScreen(s => s - 1) }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) goNext()
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) goPrev()
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#EDE4D8',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-urbanist), sans-serif',
        maxWidth: 430,
        margin: '0 auto',
        padding: '0 20px calc(env(safe-area-inset-bottom) + 24px)',
        touchAction: 'pan-y',
        overflow: 'hidden',
      }}
    >
      {/* Hero illustration */}
      <motion.div
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        style={{
          marginTop: 'max(24px, env(safe-area-inset-top))',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'grab',
        }}
      >
        <motion.div
          key={screen + '-img'}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 360,
            aspectRatio: '1 / 1',
            position: 'relative',
          }}
        >
          <Image
            src="/icons/Welcome.png"
            alt="Welcome to SpendWise"
            fill
            priority
            sizes="(max-width: 430px) 100vw, 360px"
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        style={{ marginTop: 18, flex: 1, display: 'flex', flexDirection: 'column', cursor: 'grab' }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={screen}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <h1
              style={{
                fontSize: 28,
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
              <div style={{ marginTop: 16 }}>
                <CurrencyPicker variant="full" align="left" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
        {SCREENS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { setDir(i > screen ? 1 : -1); setScreen(i) }}
            style={{
              width: i === screen ? 22 : 6,
              height: 6,
              borderRadius: 3,
              background: i === screen ? '#D07850' : 'rgba(0,0,0,0.15)',
              transition: 'all 300ms',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* CTA row */}
      {isLast ? (
        <motion.button
          type="button"
          onClick={goNext}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 999,
            background: '#1A1410',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          }}
        >
          Get Started
          <ArrowRight size={18} />
        </motion.button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            type="button"
            onClick={goPrev}
            disabled={screen === 0}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: screen === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: screen === 0 ? 0.4 : 1,
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              flexShrink: 0,
            }}
            aria-label="Back"
          >
            <ChevronLeft size={22} color="#1A1410" />
          </motion.button>

          <motion.button
            type="button"
            onClick={goNext}
            whileTap={{ scale: 0.98 }}
            style={{
              flex: 1,
              height: 56,
              borderRadius: 999,
              background: '#D07850',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 24px rgba(208,120,80,0.32)',
            }}
          >
            Next
            <ChevronRight size={20} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
