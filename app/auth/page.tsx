'use client'
import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Compass, Eye, EyeOff } from 'lucide-react'

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
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    background: 'rgb(var(--bg-card))',
    border: '1px solid rgba(var(--border), 0.08)',
    fontFamily: 'var(--font-dm)',
    fontSize: 15,
    color: 'rgb(var(--text-1))',
    outline: 'none',
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'rgb(var(--bg-primary))' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 380 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <Compass size={32} color="#5B6EF5" />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 26,
            color: 'rgb(var(--text-1))',
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          {isSignIn ? 'Welcome back' : 'Create account'}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 14,
            color: 'rgb(var(--text-3))',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          {isSignIn ? 'Sign in to your SpendWise account' : 'Start tracking your finances today'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
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
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgb(var(--text-3))',
              }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontFamily: 'var(--font-dm)', fontSize: 12, color: 'rgb(var(--danger))', paddingLeft: 4 }}
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
              borderRadius: 18,
              background: loading ? 'rgba(var(--dim))' : 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontFamily: 'var(--font-dm)',
            fontSize: 14,
            color: 'rgb(var(--text-3))',
          }}
        >
          {isSignIn ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            style={{ color: '#5B6EF5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-dm)', fontSize: 14 }}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </button>
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
