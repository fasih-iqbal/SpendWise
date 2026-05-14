import type {
  Category,
  Expense,
  Goal,
  WeeklyData,
  MonthlyData,
  ExploreFeature,
  SpendingCategory,
} from './types'

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', user_id: 'u1', name: 'Food',          emoji: '🍔', color: '#D07850', budget_limit: 600  },
  { id: '2', user_id: 'u1', name: 'Rent',          emoji: '🏠', color: '#2C6A49', budget_limit: 1000 },
  { id: '3', user_id: 'u1', name: 'Fuel',          emoji: '⛽', color: '#7F5EA8', budget_limit: 200  },
  { id: '4', user_id: 'u1', name: 'Shopping',      emoji: '🛍️', color: '#C9A830', budget_limit: 400  },
  { id: '5', user_id: 'u1', name: 'Bills',         emoji: '💡', color: '#A85D3A', budget_limit: 300  },
  { id: '6', user_id: 'u1', name: 'Entertainment', emoji: '🎮', color: '#7C8DAF', budget_limit: 150  },
  { id: '7', user_id: 'u1', name: 'Health',        emoji: '💊', color: '#3E8C5F', budget_limit: 200  },
  { id: '8', user_id: 'u1', name: 'Education',     emoji: '📚', color: '#5078A8', budget_limit: 100  },
]

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', user_id: 'u1', category_id: '2', amount: 8200.00, note: 'Paid Home Rent',    date: '2026-03-24', channel: 'offline', is_recurring: true,  recurrence_type: 'monthly', created_at: '2026-03-24T09:00:00Z' },
  { id: 'e2', user_id: 'u1', category_id: '1', amount: 124.50,  note: 'Pizza Palace',      date: '2026-05-14', channel: 'offline', is_recurring: false, created_at: '2026-05-14T20:30:00Z' },
  { id: 'e3', user_id: 'u1', category_id: '3', amount: 245.00,  note: 'Shell Station',     date: '2026-05-14', channel: 'offline', is_recurring: false, created_at: '2026-05-14T14:15:00Z' },
  { id: 'e4', user_id: 'u1', category_id: '4', amount: 489.99,  note: 'Amazon Order',      date: '2026-05-12', channel: 'online',  is_recurring: false, created_at: '2026-05-12T11:00:00Z' },
  { id: 'e5', user_id: 'u1', category_id: '1', amount: 132.00,  note: 'Grocery Run',       date: '2026-05-13', channel: 'offline', is_recurring: false, created_at: '2026-05-13T18:00:00Z' },
  { id: 'e6', user_id: 'u1', category_id: '5', amount: 195.00,  note: 'Electricity Bill',  date: '2026-05-10', channel: 'online',  is_recurring: true,  recurrence_type: 'monthly', created_at: '2026-05-10T10:00:00Z' },
  { id: 'e7', user_id: 'u1', category_id: '6', amount: 89.00,   note: 'Netflix + Spotify', date: '2026-05-08', channel: 'online',  is_recurring: true,  recurrence_type: 'monthly', created_at: '2026-05-08T12:00:00Z' },
  { id: 'e8', user_id: 'u1', category_id: '4', amount: 320.00,  note: 'Nike Store',        date: '2026-05-06', channel: 'offline', is_recurring: false, created_at: '2026-05-06T16:00:00Z' },
  { id: 'e9', user_id: 'u1', category_id: '7', amount: 110.00,  note: 'Pharmacy',          date: '2026-05-05', channel: 'offline', is_recurring: false, created_at: '2026-05-05T11:00:00Z' },
  { id: 'e10', user_id: 'u1', category_id: '1', amount: 65.00,  note: 'Coffee Bean',       date: '2026-05-04', channel: 'offline', is_recurring: false, created_at: '2026-05-04T08:30:00Z' },
]

export const MOCK_WEEKLY: WeeklyData[] = [
  { day: 'Sun', date: '2026-05-10', amount: 95  },
  { day: 'Mon', date: '2026-05-11', amount: 210 },
  { day: 'Tue', date: '2026-05-12', amount: 489.99 },
  { day: 'Wed', date: '2026-05-13', amount: 120.90 },
  { day: 'Thu', date: '2026-05-14', amount: 369.50 },
  { day: 'Fri', date: '2026-05-15', amount: 285 },
  { day: 'Sat', date: '2026-05-16', amount: 178 },
]

export const MOCK_MONTHLY: MonthlyData[] = [
  { month: 'Feb', amount: 1920 },
  { month: 'Mar', amount: 2450 },
  { month: 'Apr', amount: 2100 },
  { month: 'May', amount: 2205 },
]

export const MOCK_GOALS: Goal[] = [
  { id: 'g1', user_id: 'u1', name: 'Vacation Fund', emoji: '✈️', target_amount: 2000, saved_amount: 840 },
  { id: 'g2', user_id: 'u1', name: 'New Laptop',    emoji: '💻', target_amount: 1200, saved_amount: 600 },
  { id: 'g3', user_id: 'u1', name: 'Car Service',   emoji: '🚗', target_amount: 500,  saved_amount: 200 },
]

export const MOCK_FEATURES: ExploreFeature[] = [
  {
    id: 'f1',
    icon: '$',
    iconColor: '#D07850',
    iconBg: '#FBE7D9',
    title: 'No Minimum\nBalance',
    body: 'Maintain zero balance and avoid maintenance penalties on your account.',
    cta: 'Explore',
  },
  {
    id: 'f2',
    icon: '◎',
    iconColor: '#2C6A49',
    iconBg: '#D8E8DE',
    title: 'Zero forex marks',
    body: 'While making payments in foreign currency with credit/debit card.',
    offer: 'Offer Till 23 Jan',
  },
  {
    id: 'f3',
    icon: '⚡',
    iconColor: '#C9A830',
    iconBg: '#F4EBC9',
    title: 'Instant\nCashback',
    body: 'Earn 5% cashback on grocery and dining transactions every month.',
    cta: 'Activate',
  },
]

export const MOCK_SPENDING_CATEGORIES: SpendingCategory[] = [
  { id: 's1', name: 'Car EMI',       emoji: '🚗', color: '#1A1410' },
  { id: 's2', name: 'Shopping',      emoji: '🛍️', color: '#D07850' },
  { id: 's3', name: 'Social Media',  emoji: '📱', color: '#2C6A49' },
  { id: 's4', name: 'Property',      emoji: '🏠', color: '#C9A830' },
  { id: 's5', name: 'Travel',        emoji: '✈️', color: '#7F5EA8' },
  { id: 's6', name: 'Food',          emoji: '🍔', color: '#A85D3A' },
]

const TOTAL_BUDGET = 22000
const TOTAL_SPENT = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)
const ONLINE_SPENT = MOCK_EXPENSES.filter(e => e.channel === 'online').reduce((s, e) => s + e.amount, 0)
const OFFLINE_SPENT = MOCK_EXPENSES.filter(e => e.channel === 'offline').reduce((s, e) => s + e.amount, 0)
const REMAINING = TOTAL_BUDGET - TOTAL_SPENT
const r2 = (n: number) => Math.round(n * 100) / 100

export const MOCK_USER = {
  name: 'Alexa',
  email: 'alexa@spendwise.app',
  card_number: '**** **** **** 0023',
  card_last_four: '0023',
  card_holder: 'Naved Hasan',
  valid_thru: '08/25',
  available_credit: r2(REMAINING),
  total_budget: TOTAL_BUDGET,
}

export const MOCK_DASHBOARD = {
  totalBudget:    TOTAL_BUDGET,
  totalSpent:     r2(TOTAL_SPENT),
  totalRemaining: r2(REMAINING),
  percentUsed:    Math.round((TOTAL_SPENT / TOTAL_BUDGET) * 100),
  income:         28000,
  saved:          r2(REMAINING),
  onlineSpent:    r2(ONLINE_SPENT),
  offlineSpent:   r2(OFFLINE_SPENT),
  availableLimit: r2(REMAINING),
  monthChangePct: 20,
}
