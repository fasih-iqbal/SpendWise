'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, BarChart2, User, LogOut, Compass } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const NAV_ITEMS = [
  { href: '/dashboard',    icon: Home,           label: 'Home' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/analytics',    icon: BarChart2,      label: 'Analytics' },
  { href: '/profile',      icon: User,           label: 'Profile' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col"
      style={{
        background: 'rgb(var(--bg-surface))',
        borderRight: '1px solid rgba(var(--border), 0.06)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <Compass size={28} color="#5B6EF5" />
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 20,
            color: 'rgb(var(--text-1))',
          }}
        >
          SpendWise
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-btn transition-all duration-150"
              style={{
                background: active ? 'rgba(91,110,245,0.12)' : 'transparent',
                color: active ? '#5B6EF5' : 'rgb(var(--text-2))',
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span
                style={{
                  fontFamily: 'var(--font-dm)',
                  fontWeight: active ? 500 : 400,
                  fontSize: 14,
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        className="px-6 py-6 space-y-4"
        style={{ borderTop: '1px solid rgba(var(--border), 0.06)' }}
      >
        <ThemeToggle />
        <button
          className="flex items-center gap-2 w-full text-left"
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 14,
            color: 'rgb(var(--text-3))',
          }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
