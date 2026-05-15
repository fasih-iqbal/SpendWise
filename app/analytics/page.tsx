'use client'
import { useMemo, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { DonutChart } from '@/components/analytics/DonutChart'
import { SpendingGoalScroll } from '@/components/analytics/SpendingGoalScroll'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { CategoryManageSheet } from '@/components/profile/CategoryManageSheet'
import { useUser } from '@/lib/user-context'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useCategories } from '@/lib/hooks/useCategories'
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const { expenses, loading: expLoading, refresh } = useExpenses(user?.id)
  const { categories, addCategory, updateCategory, removeCategory } = useCategories(user?.id)
  const stats = useDashboardStats(expenses, user?.monthly_budget ?? 0)
  const [openAddCat, setOpenAddCat] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const rawExpenses = useMemo(
    () => {
      const filtered = selectedCat ? expenses.filter(e => e.category_id === selectedCat) : expenses
      return filtered.map(e => ({ date: e.date, amount: e.amount, category_id: e.category_id }))
    },
    [expenses, selectedCat],
  )

  const selectedCatDef = useMemo(
    () => selectedCat ? categories.find(c => c.id === selectedCat) ?? null : null,
    [selectedCat, categories],
  )

  const categoryDefs = useMemo(
    () => categories.map(c => ({ id: c.id, name: c.name, emoji: c.emoji, color: c.color })),
    [categories],
  )

  const spendingCats = useMemo(
    () => categories.map(c => ({
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
    <AppShell userId={user?.id} userName={user?.name} onExpenseAdded={refresh} remaining={stats.totalRemaining}>
      <AnalyticsHeader title="Analytics" />
      {expLoading ? (
        <SkeletonCard height={260} />
      ) : (
        <DonutChart
          rawExpenses={rawExpenses}
          categories={categoryDefs}
          title={selectedCatDef ? `${selectedCatDef.emoji} ${selectedCatDef.name}` : 'My Expenses'}
        />
      )}
      {spendingCats.length > 0 && (
        <SpendingGoalScroll
          categories={spendingCats}
          selected={selectedCat}
          onSelectChange={setSelectedCat}
          onCreateNew={() => setOpenAddCat(true)}
        />
      )}

      {/* Create new category sheet */}
      <CategoryManageSheet
        open={openAddCat}
        onClose={() => setOpenAddCat(false)}
        categories={categories}
        initialMode="add"
        onAdd={async c => { await addCategory(c) }}
        onUpdate={async (id, p) => { await updateCategory(id, p) }}
        onRemove={async id => { await removeCategory(id) }}
      />
    </AppShell>
  )
}
