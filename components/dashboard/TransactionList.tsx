'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrency } from '@/lib/currency'
import type { Expense, Category } from '@/lib/types'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

interface Props {
  expenses: Expense[]
  categories: Category[]
  title?: string
  showViewAll?: boolean
  onViewAll?: () => void
  onAddExpense?: () => void
  variant?: 'card' | 'plain'
  /** Pass true while data is still fetching to suppress the empty state */
  loading?: boolean
}

export function TransactionList({
  expenses,
  categories,
  title = 'Recent Activity',
  showViewAll = true,
  onViewAll,
  onAddExpense,
  variant = 'card',
  loading = false,
}: Props) {
  const { format } = useCurrency()
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  // While loading, show a neutral skeleton — no empty-state flash
  if (loading) {
    return <SkeletonCard height={200} />
  }

  if (expenses.length === 0) {
    return (
      <div
        style={{
          margin: '0 20px 20px',
          background: '#fff',
          borderRadius: 22,
          padding: '32px 20px',
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1410', marginBottom: 6 }}>No transactions yet</p>
        <p style={{ fontSize: 13, color: '#A8998A' }}>Tap the + button to record your first expense.</p>
        {onAddExpense && (
          <button
            type="button"
            onClick={onAddExpense}
            style={{
              marginTop: 16,
              padding: '10px 24px',
              background: '#D07850',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(208,120,80,0.28)',
            }}
          >
            Add Expense
          </button>
        )}
      </div>
    )
  }

  const wrapper: React.CSSProperties = variant === 'card' ? {
    margin: '0 20px 20px',
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 22,
    padding: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  } : {
    margin: '0 20px 20px',
  }

  return (
    <div style={wrapper}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: '#1A1410' }}>{title}</p>
        {showViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            style={{
              background: 'none',
              border: 'none',
              color: '#D07850',
              fontSize: 12,
              fontFamily: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            View All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <AnimatePresence initial={false}>
          {expenses.map((exp, i) => {
            const cat = catMap[exp.category_id]
            const label = exp.note ?? cat?.name ?? 'Expense'
            const dateLabel = new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < expenses.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: cat?.color ?? '#D07850',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat?.emoji ?? '💸'}</span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#1A1410', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 11, color: '#A8998A', marginTop: 1 }}>
                    {dateLabel}
                  </p>
                </div>

                <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1410', flexShrink: 0 }}>
                  {format(exp.amount, { decimals: 2 })}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

