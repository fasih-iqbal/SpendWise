'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ArrowLeftRight, BarChart2, User, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { href: '/dashboard',    icon: Home,           label: 'Home' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/analytics',    icon: BarChart2,      label: 'Analytics' },
  { href: '/profile',      icon: User,           label: 'Profile' },
]

interface Props {
  onAddExpense?: () => void
  /** Pass true to animate the nav out of view (e.g. when a sheet is open) */
  hidden?: boolean
}

export function BottomNav({ onAddExpense, hidden = false }: Props) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.nav
          key="bottom-nav"
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            /* Lifted 16px above the very bottom so it floats slightly */
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: 468,
            zIndex: 100,
            background: '#FFFFFF',
            /* Rounded pill shape since it's floating */
            borderRadius: 28,
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingTop: 10,
            paddingLeft: 4,
            paddingRight: 4,
            paddingBottom: 10,
          }}
          aria-label="Main navigation"
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
              background: '#D07850',
              boxShadow: '0 6px 20px rgba(208,120,80,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #fff',
              cursor: 'pointer',
              flexShrink: 0,
              marginTop: -20,
              position: 'relative',
              zIndex: 1,
            }}
            aria-label="Add expense"
          >
            <Plus size={24} color="#fff" strokeWidth={2.6} />
          </motion.button>

          {NAV_ITEMS.slice(2).map(item => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
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
      prefetch
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '4px 14px 2px',
        minWidth: 52,
        textDecoration: 'none',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      <Icon
        size={22}
        color={active ? '#D07850' : '#A8998A'}
        strokeWidth={active ? 2.5 : 1.5}
      />
      <span
        style={{
          fontSize: 10,
          color: active ? '#D07850' : '#A8998A',
          fontWeight: active ? 700 : 400,
          letterSpacing: active ? '0.01em' : 0,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Link>
  )
}
