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
    /*
     * position:fixed — sits above the page, always visible.
     * IMPORTANT: no ancestor must have overflow:hidden or transform,
     * otherwise WebKit clips/re-parents fixed elements.
     *
     * We center within the 500px column by using left:50% + translateX(-50%)
     * which correctly aligns with the content column on all screen sizes.
     */
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 500,
        zIndex: 100,
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 -6px 30px rgba(0,0,0,0.09)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        /* Top padding for the nav items themselves */
        paddingTop: 10,
        paddingLeft: 4,
        paddingRight: 4,
        /*
         * paddingBottom = home indicator safe area.
         * env() falls back to 14px on devices without a home bar.
         */
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
      }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.slice(0, 2).map(item => (
        <NavItem key={item.href} {...item} active={pathname === item.href} />
      ))}

      {/* FAB — floats above the nav bar */}
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
          /* Lift it above the nav bar */
          marginTop: -24,
          position: 'relative',
          zIndex: 1,
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
      prefetch
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '6px 14px 4px',
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
