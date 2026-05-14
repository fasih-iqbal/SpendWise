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
      <div className="hidden lg:block" style={{ width: 240, flexShrink: 0 }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 500, margin: '0 auto', width: '100%', position: 'relative' }}>
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 'calc(env(safe-area-inset-bottom) + 110px)' }}>
          {children}
        </main>
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
