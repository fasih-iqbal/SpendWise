'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDate } from '@/lib/utils'
import type { Expense, Category } from '@/lib/types'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  expenses: Expense[]
  categories: Category[]
  onAddExpense?: () => void
}

export function TransactionList({ expenses, categories, onAddExpense }: Props) {
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]))

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No expenses yet"
        subtitle="Tap the + button below to add your first expense."
        action={onAddExpense ? { label: 'Add Expense', onClick: onAddExpense } : undefined}
      />
    )
  }

  return (
    <div className="mx-5 mb-5">
      <p
        className="mb-4"
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 600,
          fontSize: 14,
          color: 'rgb(var(--text-1))',
        }}
      >
        Recent Transactions
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {expenses.map((exp, i) => {
            const cat = catMap[exp.category_id]
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                style={{
                  background: 'rgb(var(--bg-card))',
                  border: '1px solid rgba(var(--border), 0.06)',
                  borderRadius: 18,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Category icon */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: cat ? `${cat.color}1A` : 'rgba(91,110,245,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {cat?.emoji ?? '💸'}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-syne)',
                      fontWeight: 600,
                      fontSize: 14,
                      color: 'rgb(var(--text-1))',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {exp.note ?? cat?.name ?? 'Expense'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-dm)',
                        fontSize: 11,
                        color: 'rgb(var(--text-3))',
                      }}
                    >
                      {formatDate(exp.date)}
                    </span>
                    {cat && (
                      <span
                        style={{
                          fontFamily: 'var(--font-dm)',
                          fontSize: 10,
                          color: cat.color,
                          background: `${cat.color}1A`,
                          borderRadius: 999,
                          padding: '2px 8px',
                        }}
                      >
                        {cat.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <p
                  style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 700,
                    fontSize: 15,
                    color: 'rgb(var(--text-1))',
                    flexShrink: 0,
                  }}
                >
                  -${exp.amount.toFixed(2)}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
