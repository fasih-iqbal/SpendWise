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
            bottom: 16,
            /*
             * left + right gives natural full-width-minus-margins.
             * This is the ONLY reliable way to do this on iOS Safari with
             * position:fixed — no transform, no left:50%, no margin:auto.
             */
            left: 16,
            right: 16,
            zIndex: 30,
            background: '#FFFFFF',
            borderRadius: 28,
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 4,
            paddingRight: 4,
          }}
          aria-label="Main navigation"
        >
          {NAV_ITEMS.slice(0, 2).map(item => (
            <NavItem key={item.href} {...item} active={pathname === item.href} />
          ))}

          {/* FAB — flex:1 slot keeps it horizontally centered between
              the two left and two right NavItems, which are also flex:1. */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: 0,
            }}
          >
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
          </div>

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
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '4px 0 2px',
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
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Link>
  )
}
