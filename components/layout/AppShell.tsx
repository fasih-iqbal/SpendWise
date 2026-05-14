'use client'
import { useState } from 'react'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { AddExpenseSheet } from '@/components/expenses/AddExpenseSheet'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [showAddExpense, setShowAddExpense] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ background: 'rgb(var(--bg-primary))' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-60 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col relative"
        style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}
      >
        <div
          className="hidden lg:block fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(91,110,245,0.08) 0%, transparent 60%)',
          }}
        />
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
          {children}
        </main>
        <div className="lg:hidden">
          <BottomNav onAddExpense={() => setShowAddExpense(true)} />
        </div>
      </div>

      <AddExpenseSheet
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
      />
    </div>
  )
}
