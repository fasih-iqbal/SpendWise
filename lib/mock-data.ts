import type { Category, Expense, Goal, WeeklyData, MonthlyData } from './types'

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', user_id: 'u1', name: 'Food',         emoji: '🍔', color: '#5B6EF5', budget_limit: 600  },
  { id: '2', user_id: 'u1', name: 'Rent',         emoji: '🏠', color: '#2DD4BF', budget_limit: 1000 },
  { id: '3', user_id: 'u1', name: 'Fuel',         emoji: '⛽', color: '#F472B6', budget_limit: 200  },
  { id: '4', user_id: 'u1', name: 'Shopping',     emoji: '🛍️', color: '#FBBF24', budget_limit: 400  },
  { id: '5', user_id: 'u1', name: 'Bills',        emoji: '💡', color: '#F87171', budget_limit: 300  },
  { id: '6', user_id: 'u1', name: 'Entertainment',emoji: '🎮', color: '#A78BFA', budget_limit: 150  },
  { id: '7', user_id: 'u1', name: 'Health',       emoji: '💊', color: '#34D399', budget_limit: 200  },
  { id: '8', user_id: 'u1', name: 'Education',    emoji: '📚', color: '#60A5FA', budget_limit: 100  },
]

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', user_id: 'u1', category_id: '1', amount: 24.50,  note: 'Pizza Palace',      date: '2025-05-14', is_recurring: false, created_at: '2025-05-14T20:30:00Z' },
  { id: 'e2', user_id: 'u1', category_id: '3', amount: 45.00,  note: 'Shell Station',     date: '2025-05-14', is_recurring: false, created_at: '2025-05-14T14:15:00Z' },
  { id: 'e3', user_id: 'u1', category_id: '4', amount: 89.99,  note: 'Amazon Order',      date: '2025-05-12', is_recurring: false, created_at: '2025-05-12T11:00:00Z' },
  { id: 'e4', user_id: 'u1', category_id: '2', amount: 800.00, note: 'Monthly Rent',      date: '2025-05-01', is_recurring: true,  recurrence_type: 'monthly', created_at: '2025-05-01T09:00:00Z' },
  { id: 'e5', user_id: 'u1', category_id: '1', amount: 32.00,  note: 'Grocery run',       date: '2025-05-13', is_recurring: false, created_at: '2025-05-13T18:00:00Z' },
  { id: 'e6', user_id: 'u1', category_id: '5', amount: 95.00,  note: 'Electricity Bill',  date: '2025-05-10', is_recurring: true,  recurrence_type: 'monthly', created_at: '2025-05-10T10:00:00Z' },
]

export const MOCK_WEEKLY: WeeklyData[] = [
  { day: 'Mon', amount: 120 },
  { day: 'Tue', amount: 85  },
  { day: 'Wed', amount: 310 },
  { day: 'Thu', amount: 65  },
  { day: 'Fri', amount: 180 },
  { day: 'Sat', amount: 420 },
  { day: 'Sun', amount: 45  },
]

export const MOCK_MONTHLY: MonthlyData[] = [
  { month: 'Feb', amount: 1920 },
  { month: 'Mar', amount: 2450 },
  { month: 'Apr', amount: 2100 },
  { month: 'May', amount: 2205 },
]

export const MOCK_GOALS: Goal[] = [
  { id: 'g1', user_id: 'u1', name: 'Vacation Fund', emoji: '✈️', target_amount: 2000, saved_amount: 840  },
  { id: 'g2', user_id: 'u1', name: 'New Laptop',    emoji: '💻', target_amount: 1200, saved_amount: 600  },
  { id: 'g3', user_id: 'u1', name: 'Car Service',   emoji: '🚗', target_amount: 500,  saved_amount: 200  },
]

export const MOCK_DASHBOARD = {
  totalBudget:    3500,
  totalSpent:     2205,
  totalRemaining: 1295,
  percentUsed:    63,
  income:         4200,
  saved:          700,
}
