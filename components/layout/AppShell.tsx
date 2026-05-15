'use client'
import { useState } from 'react'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { LockGate } from './LockGate'
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet'

interface Props {
  children: React.ReactNode
  userName?: string
  userId?: string
  onExpenseAdded?: () => void
}

export function AppShell({ children, userName, userId, onExpenseAdded }: Props) {
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
          paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 8px)',
        }}
      >
        {children}
      </div>

      {/* BottomNav — mobile only, rendered outside any overflow container */}
      <div className="lg:hidden">
        <BottomNav onAddExpense={() => setShowAddExpense(true)} />
      </div>

      <AddExpenseSheet
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        userId={userId}
        onSaved={() => { setShowAddExpense(false); onExpenseAdded?.() }}
      />
    </div>
  )
}
