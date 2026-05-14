'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
      style={{ background: 'rgb(var(--bg-primary))' }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,110,245,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 320 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(91,110,245,0.4)',
            }}
          >
            <Compass size={40} color="#fff" />
          </div>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 36,
            color: 'rgb(var(--text-1))',
            marginBottom: 12,
            lineHeight: 1.1,
          }}
        >
          SpendWise
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 16,
            color: 'rgb(var(--text-3))',
            marginBottom: 48,
            lineHeight: 1.6,
          }}
        >
          Track your expenses, set budgets, and reach your financial goals — beautifully.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link
            href="/auth"
            style={{
              display: 'block',
              padding: '16px 32px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(91,110,245,0.4)',
            }}
          >
            Get Started
          </Link>
          <Link
            href="/auth?mode=signin"
            style={{
              display: 'block',
              padding: '16px 32px',
              borderRadius: 18,
              background: 'rgba(var(--bg-card))',
              color: 'rgb(var(--text-2))',
              fontFamily: 'var(--font-syne)',
              fontWeight: 600,
              fontSize: 16,
              textDecoration: 'none',
              border: '1px solid rgba(var(--border), 0.08)',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Preview dashboard link for development */}
        <p style={{ marginTop: 24, fontFamily: 'var(--font-dm)', fontSize: 12, color: 'rgb(var(--text-3))' }}>
          <Link href="/dashboard" style={{ color: '#5B6EF5', textDecoration: 'none' }}>
            Preview Dashboard →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
