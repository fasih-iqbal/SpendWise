'use client'
import { useMemo, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { ExpenseHeroCard } from '@/components/dashboard/ExpenseHeroCard'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { BudgetSheet } from '@/components/profile/BudgetSheet'
import { Wallet } from 'lucide-react'
import { useUser } from '@/lib/user-context'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useCategories } from '@/lib/hooks/useCategories'
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'

export default function DashboardPage() {
  const { user, loading: userLoading, refresh: refreshUser } = useUser()
  const [openBudget, setOpenBudget] = useState(false)
  const { expenses, loading: expLoading, refresh: refreshExp } = useExpenses(user?.id)
  const { categories } = useCategories(user?.id)
  const totalBudget = user?.monthly_budget ?? 0

  const stats = useDashboardStats(expenses, totalBudget)

  const recent = useMemo(
    () => [...expenses].slice(0, 4),
    [expenses]
  )

  const cardHolder = user?.name ?? 'Card Holder'
  const cardLastFour = deriveLastFour(user?.id)
  const validThru = deriveValidThru(user?.id)

  if (userLoading) {
    return (
      <AppShell>
        <Header userName="…" />
        <SkeletonCard height={160} />
        <SkeletonCard height={200} />
      </AppShell>
    )
  }

  return (
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refreshExp} remaining={stats.totalRemaining}>
      <Header userName={user?.name ?? 'there'} avatarUrl={user?.avatar_url} />
      <ExpenseHeroCard
        availableCredit={Math.max(0, stats.totalRemaining)}
        cardLastFour={cardLastFour}
        cardHolder={cardHolder}
        validThru={validThru}
      />
      {totalBudget === 0 && (
        <button
          type="button"
          onClick={() => setOpenBudget(true)}
          style={{
            margin: '0 20px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            width: 'calc(100% - 40px)',
            background: 'linear-gradient(135deg, #FBE7D9, #F5EFE8)',
            border: '1px dashed #D07850',
            borderRadius: 18,
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Wallet size={20} color="#D07850" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1410', marginBottom: 2 }}>
              Set your monthly budget
            </p>
            <p style={{ fontSize: 12, color: '#65574A' }}>
              Tap to start tracking against a target.
            </p>
          </div>
        </button>
      )}
      <WeeklyChart expenses={expenses} />
      <TransactionList
        expenses={recent}
        categories={categories}
        title={expLoading ? 'Loading…' : 'Recent Activity'}
        showViewAll
      />
      <BudgetSheet
        open={openBudget}
        onClose={() => setOpenBudget(false)}
        userId={user?.id}
        current={user?.monthly_budget ?? 0}
        onSaved={() => { refreshUser() }}
      />
    </AppShell>
  )
}

function deriveLastFour(id?: string) {
  if (!id) return '0000'
  const digits = id.replace(/\D/g, '')
  return (digits.slice(-4) || '0000').padStart(4, '0')
}

function deriveValidThru(id?: string) {
  const now = new Date()
  const year = ((now.getFullYear() + 3) % 100).toString().padStart(2, '0')
  if (!id) return `12/${year}`
  const digits = id.replace(/\D/g, '')
  const monthIdx = (parseInt(digits.slice(0, 2) || '12', 10) % 12) + 1
  return `${String(monthIdx).padStart(2, '0')}/${year}`
}
