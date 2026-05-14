'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SetupPage() {
  const router = useRouter()
  const [budget, setBudget] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ name, monthly_budget: parseFloat(budget), setup_complete: true })
        .eq('id', user.id)

      const { count } = await supabase
        .from('categories')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
      if (!count) {
        const defaults = [
          { name: 'Food',          emoji: '🍔', color: '#D07850', budget_limit: 0 },
          { name: 'Rent',          emoji: '🏠', color: '#2C6A49', budget_limit: 0 },
          { name: 'Fuel',          emoji: '⛽', color: '#7F5EA8', budget_limit: 0 },
          { name: 'Shopping',      emoji: '🛍️', color: '#C9A830', budget_limit: 0 },
          { name: 'Bills',         emoji: '💡', color: '#A85D3A', budget_limit: 0 },
          { name: 'Entertainment', emoji: '🎮', color: '#7C8DAF', budget_limit: 0 },
          { name: 'Health',        emoji: '💊', color: '#3E8C5F', budget_limit: 0 },
          { name: 'Transport',     emoji: '🚌', color: '#5078A8', budget_limit: 0 },
        ].map(c => ({ ...c, user_id: user.id }))
        await supabase.from('categories').insert(defaults)
      }
    }
    router.push('/pin?mode=set')
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
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 26,
            color: 'rgb(var(--text-1))',
            marginBottom: 8,
          }}
        >
          Set up your budget
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 14,
            color: 'rgb(var(--text-3))',
            marginBottom: 32,
          }}
        >
          We&apos;ll use this to track how you&apos;re doing each month.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgb(var(--bg-card))',
              border: '1px solid rgba(var(--border), 0.08)',
              fontFamily: 'var(--font-dm)',
              fontSize: 15,
              color: 'rgb(var(--text-1))',
              outline: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 18,
                color: '#5B6EF5',
              }}
            >
              $
            </span>
            <input
              type="number"
              placeholder="Monthly budget"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              required
              min="1"
              style={{
                width: '100%',
                padding: '14px 16px 14px 32px',
                borderRadius: 14,
                background: 'rgb(var(--bg-card))',
                border: '1px solid rgba(var(--border), 0.08)',
                fontFamily: 'var(--font-syne)',
                fontWeight: 700,
                fontSize: 18,
                color: 'rgb(var(--text-1))',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '16px',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
              color: '#fff',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
