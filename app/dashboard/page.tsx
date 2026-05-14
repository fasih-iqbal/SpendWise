import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { ExpenseHeroCard } from '@/components/dashboard/ExpenseHeroCard'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { InsightBanner } from '@/components/dashboard/InsightBanner'
import { CategoryScroll } from '@/components/dashboard/CategoryScroll'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { TransactionList } from '@/components/dashboard/TransactionList'
import {
  MOCK_DASHBOARD,
  MOCK_CATEGORIES,
  MOCK_EXPENSES,
  MOCK_WEEKLY,
} from '@/lib/mock-data'
import { MONTHS } from '@/lib/constants'

export default function DashboardPage() {
  const now = new Date()
  const month = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  return (
    <AppShell>
      <Header userName="Alex" />
      <ExpenseHeroCard stats={MOCK_DASHBOARD} month={month} />
      <QuickStats
        income={MOCK_DASHBOARD.income}
        saved={MOCK_DASHBOARD.saved}
        percentUsed={MOCK_DASHBOARD.percentUsed}
      />
      <InsightBanner />
      <CategoryScroll categories={MOCK_CATEGORIES} />
      <WeeklyChart data={MOCK_WEEKLY} />
      <TransactionList
        expenses={MOCK_EXPENSES}
        categories={MOCK_CATEGORIES}
      />
    </AppShell>
  )
}
