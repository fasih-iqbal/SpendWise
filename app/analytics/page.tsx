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
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const { expenses, loading: expLoading, refresh } = useExpenses(user?.id)
  const { categories } = useCategories(user?.id)
  const stats = useDashboardStats(expenses, user?.monthly_budget ?? 0)

  const spendingCats = useMemo(
    () => categories.slice(0, 8).map(c => ({
      id: c.id, name: c.name, emoji: c.emoji, color: c.color,
    })),
    [categories]
  )

  if (userLoading) {
    return (
      <AppShell>
        <AnalyticsHeader title="Analytics" />
        <SkeletonCard height={260} />
      </AppShell>
    )
  }

  const available = Math.max(0, stats.totalRemaining)

  return (
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refresh}>
      <AnalyticsHeader title="Analytics" />
      {expLoading ? (
        <SkeletonCard height={260} />
      ) : (
        <DonutChart
          onlineSpend={stats.onlineSpent}
          offlineSpend={stats.offlineSpent}
          availableLimit={available}
          changePct={stats.monthChangePct}
          title="My Expenses"
          period="This month"
        />
      )}
      {spendingCats.length > 0 && (
        <SpendingGoalScroll categories={spendingCats} />
      )}
    </AppShell>
  )
}
