'use client'
import { useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { useUser } from '@/lib/user-context'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useCategories } from '@/lib/hooks/useCategories'

export default function TransactionsPage() {
  const { user, loading: userLoading } = useUser()
  const { expenses, loading: expLoading, refresh } = useExpenses(user?.id)
  const { categories } = useCategories(user?.id)

  const sorted = useMemo(
    () => [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenses]
  )

  if (userLoading) {
    return (
      <AppShell>
        <Header userName="…" />
        <SkeletonCard height={300} />
      </AppShell>
    )
  }

  return (
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refresh}>
      <Header userName={user?.name ?? 'there'} avatarUrl={user?.avatar_url} />
      <div style={{ paddingTop: 4 }}>
        <h2
          style={{
            margin: '0 20px 12px',
            fontWeight: 700,
            fontSize: 22,
            color: '#1A1410',
            letterSpacing: '-0.01em',
          }}
        >
          All Transactions
        </h2>
        <TransactionList
          expenses={sorted}
          categories={categories}
          title={expLoading ? 'Loading…' : `${sorted.length} entries`}
          showViewAll={false}
        />
      </div>
    </AppShell>
  )
}
