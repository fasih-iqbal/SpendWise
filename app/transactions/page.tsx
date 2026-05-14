import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { MOCK_EXPENSES, MOCK_CATEGORIES, MOCK_USER } from '@/lib/mock-data'

export default function TransactionsPage() {
  const sorted = [...MOCK_EXPENSES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <AppShell>
      <Header userName={MOCK_USER.name} />
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
          categories={MOCK_CATEGORIES}
          title={`${sorted.length} entries`}
          showViewAll={false}
        />
      </div>
    </AppShell>
  )
}
