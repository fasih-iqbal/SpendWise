import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { ExpenseHeroCard } from '@/components/dashboard/ExpenseHeroCard'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { TransactionList } from '@/components/dashboard/TransactionList'
import {
  MOCK_USER,
  MOCK_WEEKLY,
  MOCK_EXPENSES,
  MOCK_CATEGORIES,
} from '@/lib/mock-data'

export default function DashboardPage() {
  const recent = [...MOCK_EXPENSES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <AppShell>
      <Header userName={MOCK_USER.name} />
      <ExpenseHeroCard
        availableCredit={MOCK_USER.available_credit}
        cardLastFour={MOCK_USER.card_last_four}
        cardHolder={MOCK_USER.card_holder}
        validThru={MOCK_USER.valid_thru}
      />
      <WeeklyChart data={MOCK_WEEKLY} />
      <TransactionList
        expenses={recent}
        categories={MOCK_CATEGORIES}
        title="Recent Activity"
        showViewAll
      />
    </AppShell>
  )
}
