import { AppShell } from '@/components/layout/AppShell'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { DonutChart } from '@/components/analytics/DonutChart'
import { ExploreFeatures } from '@/components/analytics/ExploreFeatures'
import { SpendingGoalScroll } from '@/components/analytics/SpendingGoalScroll'
import {
  MOCK_DASHBOARD,
  MOCK_FEATURES,
  MOCK_SPENDING_CATEGORIES,
} from '@/lib/mock-data'

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsHeader title="Analytics" />
      <DonutChart
        onlineSpend={MOCK_DASHBOARD.onlineSpent}
        offlineSpend={MOCK_DASHBOARD.offlineSpent}
        availableLimit={MOCK_DASHBOARD.availableLimit}
        changePct={MOCK_DASHBOARD.monthChangePct}
        title="My Expenses"
        period="This month"
      />
      <ExploreFeatures features={MOCK_FEATURES} />
      <SpendingGoalScroll categories={MOCK_SPENDING_CATEGORIES} />
    </AppShell>
  )
}
