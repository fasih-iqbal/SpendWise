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
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#EDE4D8', fontFamily: 'var(--font-urbanist), sans-serif' }}>
      <LockGate />
      {/* Sidebar — desktop only, not rendered in DOM on mobile */}
      <div style={{ width: 240, flexShrink: 0, display: 'none' }} className="lg:block">
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 500, margin: '0 auto', width: '100%', position: 'relative', willChange: 'transform' }}>
        <main style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', paddingBottom: 'calc(env(safe-area-inset-bottom) + 110px)' }}>
          {children}
        </main>
        {/* BottomNav — mobile only */}
        <div style={{ display: 'block' }} className="lg:hidden">
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
