'use client'
import { useMemo } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { DonutChart, type DonutSlice } from '@/components/analytics/DonutChart'
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

  const { slices, total } = useMemo(() => {
    const totals = new Map<string, number>()
    for (const e of stats.monthExpenses) {
      const key = e.category_id ?? 'uncat'
      totals.set(key, (totals.get(key) ?? 0) + Number(e.amount))
    }
    const items: DonutSlice[] = Array.from(totals.entries()).map(([id, value]) => {
      const cat = categories.find(c => c.id === id)
      return {
        key: id,
        label: cat?.name ?? 'Uncategorized',
        emoji: cat?.emoji,
        color: cat?.color ?? '#A8998A',
        value,
      }
    }).sort((a, b) => b.value - a.value)
    const sum = items.reduce((s, x) => s + x.value, 0)
    return { slices: items, total: sum }
  }, [stats.monthExpenses, categories])

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

  return (
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refresh}>
      <AnalyticsHeader title="Analytics" />
      {expLoading ? (
        <SkeletonCard height={260} />
      ) : (
        <DonutChart
          slices={slices}
          total={total}
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
