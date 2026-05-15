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
    <div
      style={{
        display: 'flex',
        /* Use 100dvh so it respects the dynamic viewport on iOS Safari */
        height: '100dvh',
        background: '#EDE4D8',
        fontFamily: 'var(--font-urbanist), sans-serif',
        overflow: 'hidden',
      }}
    >
      <LockGate />

      {/* Sidebar — desktop only, hidden via inline + Tailwind override */}
      <div style={{ width: 240, flexShrink: 0, display: 'none' }} className="lg:block">
        <Sidebar />
      </div>

      {/* Main column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 500,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            /* 64px nav height + safe-area home bar + a little breathing room */
            paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 16px) + 16px)',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </main>

        {/* BottomNav rendered inside the column; the nav itself is position:fixed */}
        <div className="lg:hidden">
          <BottomNav onAddExpense={() => setShowAddExpense(true)} />
        </div>
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
