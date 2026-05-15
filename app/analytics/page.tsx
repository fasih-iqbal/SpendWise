'use client'
import { useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { DonutChart } from '@/components/analytics/DonutChart'
import { SpendingGoalScroll } from '@/components/analytics/SpendingGoalScroll'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { useUser } from '@/lib/user-context'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useCategories } from '@/lib/hooks/useCategories'

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const { expenses, loading: expLoading, refresh } = useExpenses(user?.id)
  const { categories } = useCategories(user?.id)

  const rawExpenses = useMemo(
    () => expenses.map(e => ({ date: e.date, amount: e.amount, category_id: e.category_id })),
    [expenses],
  )

  const categoryDefs = useMemo(
    () => categories.map(c => ({ id: c.id, name: c.name, emoji: c.emoji, color: c.color })),
    [categories],
  )

  const spendingCats = useMemo(
    () => categories.slice(0, 8).map(c => ({
      id: c.id, name: c.name, emoji: c.emoji, color: c.color,
    })),
    [categories],
  )

  if (userLoading) {
    return (
      <AppShell>
        <AnalyticsHeader title="Analytics" />
        <SkeletonCard height={260} />
      </AppShell>
    )
  }

  return (
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refresh}>
      <AnalyticsHeader title="Analytics" />
      {expLoading ? (
        <SkeletonCard height={260} />
      ) : (
        <DonutChart
          rawExpenses={rawExpenses}
          categories={categoryDefs}
          title="My Expenses"
        />
      )}
      {spendingCats.length > 0 && (
        <SpendingGoalScroll categories={spendingCats} />
      )}
    </AppShell>
  )
}
