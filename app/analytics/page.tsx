import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { DonutChart } from '@/components/analytics/DonutChart'
import { MonthComparison } from '@/components/analytics/MonthComparison'
import { GoalsCard } from '@/components/analytics/GoalsCard'
import { MOCK_EXPENSES, MOCK_CATEGORIES, MOCK_MONTHLY, MOCK_GOALS } from '@/lib/mock-data'

export default function AnalyticsPage() {
  return (
    <AppShell>
      <Header userName="Alex" />
      <div style={{ paddingTop: 8 }}>
        <h2
          className="px-5 mb-4"
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 22,
            color: 'rgb(var(--text-1))',
          }}
        >
          Analytics
        </h2>
        <DonutChart expenses={MOCK_EXPENSES} categories={MOCK_CATEGORIES} />
        <MonthComparison data={MOCK_MONTHLY} />
        <GoalsCard goals={MOCK_GOALS} />
      </div>
    </AppShell>
  )
}
