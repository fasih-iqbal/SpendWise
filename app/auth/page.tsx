'use client'
import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSignIn, setIsSignIn] = useState(searchParams.get('mode') === 'signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        router.push('/setup')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.08)',
    fontFamily: 'var(--font-urbanist), sans-serif',
    fontSize: 15,
    color: '#1A1410',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: '#EDE4D8', fontFamily: 'var(--font-urbanist), sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 380 }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg, #D07850, #C9A830)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(208,120,80,0.3)' }}>
            <span style={{ fontSize: 26 }}>💰</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: '#1A1410', textAlign: 'center', marginBottom: 6 }}>
            {isSignIn ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ fontSize: 14, color: '#A8998A', textAlign: 'center', marginBottom: 28 }}>
            {isSignIn ? 'Sign in to your SpendWise account' : 'Start tracking your finances today'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A8998A' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontSize: 12, color: '#D07850', paddingLeft: 4 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: '16px',
                borderRadius: 14,
                background: loading ? '#E0D5C9' : '#D07850',
                color: '#fff',
                fontFamily: 'var(--font-urbanist), sans-serif',
                fontWeight: 700,
                fontSize: 16,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 200ms ease',
              }}
            >
              {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#A8998A' }}>
            {isSignIn ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              style={{ color: '#D07850', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-urbanist), sans-serif', fontSize: 14, fontWeight: 600 }}
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Dev link */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#A8998A' }}>
          <a href="/dashboard" style={{ color: '#D07850', textDecoration: 'none' }}>Preview Dashboard →</a>
        </p>
      </motion.div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
