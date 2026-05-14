export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  currency: string
  monthly_budget: number
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  budget_limit: number
}

export interface Expense {
  id: string
  user_id: string
  category_id: string
  category?: Category
  amount: number
  note?: string
  date: string
  channel?: 'online' | 'offline'
  is_recurring: boolean
  recurrence_type?: 'weekly' | 'monthly'
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  month: number
  year: number
  total_budget: number
}

export interface Goal {
  id: string
  user_id: string
  name: string
  emoji: string
  target_amount: number
  saved_amount: number
}

export interface DashboardStats {
  totalBudget: number
  totalSpent: number
  totalRemaining: number
  percentUsed: number
  income: number
  saved: number
}

export interface WeeklyData {
  day: string
  amount: number
  date: string
}

export interface MonthlyData {
  month: string
  amount: number
}

export interface ExploreFeature {
  id: string
  icon: string
  iconColor: string
  iconBg: string
  title: string
  body: string
  cta?: string
  offer?: string
}

export interface SpendingCategory {
  id: string
  name: string
  emoji: string
  color: string
}

export interface CurrencyDef {
  code: string
  symbol: string
  name: string
  flag: string
  locale: string
}
