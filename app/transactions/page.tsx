import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { MOCK_EXPENSES, MOCK_CATEGORIES } from '@/lib/mock-data'

export default function TransactionsPage() {
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
          All Transactions
        </h2>
        <TransactionList
          expenses={MOCK_EXPENSES}
          categories={MOCK_CATEGORIES}
        />
      </div>
    </AppShell>
  )
}
