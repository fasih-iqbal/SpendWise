'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, ArrowLeftRight, BarChart2, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard',    icon: Home,           label: 'Home' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/analytics',    icon: BarChart2,      label: 'Analytics' },
  { href: '/profile',      icon: User,           label: 'Profile' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col"
      style={{
        background: '#F5EFE8',
        borderRight: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '28px 24px 20px' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #D07850, #C9A830)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 18 }}>💰</span>
        </div>
        <span style={{ fontFamily: 'var(--font-urbanist), sans-serif', fontWeight: 800, fontSize: 20, color: '#1A1410' }}>
          SpendWise
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 14,
                background: active ? 'rgba(208,120,80,0.12)' : 'transparent',
                color: active ? '#D07850' : '#65574A',
                textDecoration: 'none',
                transition: 'all 150ms ease',
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} color={active ? '#D07850' : '#65574A'} />
              <span style={{ fontFamily: 'var(--font-urbanist), sans-serif', fontWeight: active ? 600 : 400, fontSize: 14, color: active ? '#D07850' : '#65574A' }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '16px 24px 24px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <button
          onClick={signOut}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-urbanist), sans-serif', fontSize: 14, color: '#A8998A' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
