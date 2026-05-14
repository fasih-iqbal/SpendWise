'use client'
import { useMemo } from 'react'
import type { Expense, WeeklyData } from '@/lib/types'

interface Result {
  totalSpent: number
  totalRemaining: number
  percentUsed: number
  onlineSpent: number
  offlineSpent: number
  monthChangePct: number
  monthExpenses: Expense[]
  weekly: WeeklyData[]
}

const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export function useDashboardStats(expenses: Expense[], totalBudget: number): Result {
  return useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    const monthExpenses = expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === month && d.getFullYear() === year
    })

    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const prevMonthExpenses = expenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear
    })

    const totalSpent = monthExpenses.reduce((s, e) => s + Number(e.amount), 0)
    const prevTotal  = prevMonthExpenses.reduce((s, e) => s + Number(e.amount), 0)
    const onlineSpent = monthExpenses.filter(e => e.channel === 'online').reduce((s, e) => s + Number(e.amount), 0)
    const offlineSpent = monthExpenses.filter(e => e.channel === 'offline').reduce((s, e) => s + Number(e.amount), 0)

    const monthChangePct = prevTotal > 0
      ? Math.round(((totalSpent - prevTotal) / prevTotal) * 100)
      : 0

    // last 7 days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekly: WeeklyData[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const iso = d.toISOString().split('T')[0]
      const dayTotal = expenses
        .filter(e => e.date === iso)
        .reduce((s, e) => s + Number(e.amount), 0)
      weekly.push({ day: dayLabels[d.getDay()], date: iso, amount: dayTotal })
    }

    return {
      totalSpent: round2(totalSpent),
      totalRemaining: round2(totalBudget - totalSpent),
      percentUsed: totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0,
      onlineSpent: round2(onlineSpent),
      offlineSpent: round2(offlineSpent),
      monthChangePct,
      monthExpenses,
      weekly,
    }
  }, [expenses, totalBudget])
}

function round2(n: number) { return Math.round(n * 100) / 100 }
