'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, BarChart2, User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/dashboard',     icon: Home,            label: 'Home' },
  { href: '/transactions',  icon: ArrowLeftRight,  label: 'Transactions' },
  { href: '/analytics',     icon: BarChart2,       label: 'Analytics' },
  { href: '/profile',       icon: User,            label: 'Profile' },
]

interface Props {
  onAddExpense?: () => void
}

export function BottomNav({ onAddExpense }: Props) {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'rgba(14,18,32,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 72,
      }}
    >
      {NAV_ITEMS.slice(0, 2).map(item => (
        <NavItem key={item.href} {...item} active={pathname === item.href} />
      ))}

      {/* FAB */}
      <motion.button
        onClick={onAddExpense}
        whileTap={{ scale: 0.95 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5B6EF5, #2DD4BF)',
          boxShadow: '0 8px 24px rgba(91,110,245,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
        aria-label="Add expense"
      >
        <Plus size={24} color="#fff" strokeWidth={2.5} />
      </motion.button>

      {NAV_ITEMS.slice(2).map(item => (
        <NavItem key={item.href} {...item} active={pathname === item.href} />
      ))}
    </nav>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-4 py-2"
      style={{ minWidth: 56 }}
    >
      <Icon
        size={20}
        color={active ? '#5B6EF5' : 'rgb(var(--text-3))'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      <span
        style={{
          fontFamily: 'var(--font-dm)',
          fontSize: 10,
          color: active ? '#5B6EF5' : 'rgb(var(--text-3))',
          fontWeight: active ? 500 : 400,
        }}
      >
        {label}
      </span>
    </Link>
  )
}
