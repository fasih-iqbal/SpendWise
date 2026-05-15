'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Peer-level page transitions.
 *
 * Bottom-nav tabs are siblings: Home → Transactions → Analytics → Profile.
 * Switching tabs slides horizontally in the direction of the index delta.
 * Routes outside the tab set (/splits, /pin, ...) slide in from the right
 * on push and out to the right on back, matching iOS-style stack semantics.
 */

const TAB_ORDER = ['/dashboard', '/transactions', '/analytics', '/profile']

function tabIndex(path: string): number {
  return TAB_ORDER.findIndex(p => path === p || path.startsWith(`${p}/`))
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPath = useRef(pathname)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    const from = prevPath.current
    const to = pathname
    if (from === to) return

    const fromTab = tabIndex(from)
    const toTab = tabIndex(to)

    if (fromTab >= 0 && toTab >= 0) {
      // Tab → tab: slide based on index delta.
      setDirection(toTab > fromTab ? 1 : -1)
    } else if (fromTab >= 0 && toTab < 0) {
      // Tab → deeper route: slide in from the right.
      setDirection(1)
    } else if (fromTab < 0 && toTab >= 0) {
      // Deeper route → tab: slide out to the right (back gesture).
      setDirection(-1)
    } else {
      setDirection(1)
    }

    prevPath.current = to
  }, [pathname])

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={pathname}
          custom={direction}
          initial={{ x: direction === 0 ? 0 : direction * 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -32, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
