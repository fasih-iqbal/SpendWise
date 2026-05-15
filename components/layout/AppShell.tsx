'use client'
import { useState } from 'react'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { LockGate } from './LockGate'
import { PageTransition } from './PageTransition'
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet'

interface Props {
  children: React.ReactNode
  userName?: string
  userId?: string
  onExpenseAdded?: () => void
  /** Remaining budget for current month — used to warn before going over. */
  remaining?: number
  /** Force-hide the mobile bottom nav (e.g. while a custom sheet is open on a child page). */
  hideBottomNav?: boolean
}

export function AppShell({ children, userName, userId, onExpenseAdded, remaining, hideBottomNav }: Props) {
  const [showAddExpense, setShowAddExpense] = useState(false)

  return (
    /*
     * Root: plain flex row, NO overflow:hidden, NO height constraint.
     * overflow:hidden on any ancestor will clip position:fixed children
     * on iOS Safari/WebKit — this is the core bug we are fixing.
     */
    <div
      style={{
        display: 'flex',
        minHeight: '100dvh',
        background: '#EDE4D8',
        fontFamily: 'var(--font-urbanist), sans-serif',
      }}
    >
      <LockGate />

      {/* Sidebar — desktop only */}
      <div style={{ width: 240, flexShrink: 0, display: 'none' }} className="lg:block">
        <Sidebar />
      </div>

      {/*
       * Scrollable content column.
       * paddingBottom = nav bar height (64px) + iOS home-bar (safe-area-inset-bottom) + gap (8px)
       * We never set overflow:hidden here — the page itself scrolls naturally.
       */}
      <div
        style={{
          flex: 1,
          maxWidth: 500,
          margin: '0 auto',
          width: '100%',
          paddingBottom: 'calc(92px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <PageTransition>{children}</PageTransition>
      </div>

      {/* BottomNav — mobile only, hidden while Add Expense sheet is open */}
      <div className="lg:hidden">
        <BottomNav
          onAddExpense={() => setShowAddExpense(true)}
          hidden={showAddExpense || !!hideBottomNav}
        />
      </div>

      <AddExpenseSheet
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        userId={userId}
        remaining={remaining}
        onSaved={() => { setShowAddExpense(false); onExpenseAdded?.() }}
      />
    </div>
  )
}
