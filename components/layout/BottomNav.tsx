'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, BarChart2, User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/dashboard',    icon: Home,           label: 'Home' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/analytics',    icon: BarChart2,      label: 'Analytics' },
  { href: '/profile',      icon: User,           label: 'Profile' },
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
        background: '#fff',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        paddingTop: 10,
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 14px)',
        minHeight: 86,
        maxWidth: 500,
        margin: '0 auto',
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
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#D07850',
          boxShadow: '0 8px 24px rgba(208,120,80,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #fff',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: -22,
        }}
        aria-label="Add expense"
      >
        <Plus size={26} color="#fff" strokeWidth={2.6} />
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
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 16px', minWidth: 56, textDecoration: 'none' }}
    >
      <Icon
        size={20}
        color={active ? '#D07850' : '#A8998A'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      <span
        style={{
          fontSize: 10,
          color: active ? '#D07850' : '#A8998A',
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </span>
    </Link>
  )
}
