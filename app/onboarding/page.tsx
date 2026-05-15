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
  const isFirst = screen === 0

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
      {/* Hero: Logo + brand instead of image */}
      <motion.div
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        style={{
          marginTop: 'max(56px, calc(env(safe-area-inset-top) + 36px))',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'grab',
          flexShrink: 0,
        }}
      >
        <motion.div
          key={screen + '-img'}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: '36px 0 28px',
            background: 'rgba(255,255,255,0.55)',
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: 26,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            <Image
              src="/icons/logo-192.png"
              alt="SpendWise"
              width={90}
              height={90}
              priority
              style={{ objectFit: 'cover', borderRadius: 26, display: 'block' }}
            />
          </div>

          {/* Brand name */}
          <p
            style={{
              fontWeight: 800,
              fontSize: 30,
              color: '#1A1410',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            SpendWise
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: 13,
              color: '#A8998A',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            Budget tracking redefined
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragElastic={0.18}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        style={{ marginTop: 40, display: 'flex', flexDirection: 'column', cursor: 'grab', flexShrink: 0 }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={screen}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column' }}
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

      {/* Spacer pushes CTA + dots to bottom on tall screens */}
      <div style={{ flex: 1, minHeight: 16 }} />

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

      {/* CTA row — full-width Next on first slide, back+next on middle slides, Get Started on last */}
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
      ) : isFirst ? (
        /* First slide: full-width Next button, no back arrow */
        <motion.button
          type="button"
          onClick={goNext}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
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
      ) : (
        /* Middle slides: back + next */
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            type="button"
            onClick={goPrev}
            whileTap={{ scale: 0.94 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
