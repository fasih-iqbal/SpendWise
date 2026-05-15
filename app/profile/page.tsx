'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Wallet, TrendingDown, PiggyBank, Tags, Plus, KeyRound, ShieldOff, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { SettingsCard } from '@/components/profile/SettingsCard'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'
import { CategoryManageSheet } from '@/components/profile/CategoryManageSheet'
import { BudgetSheet } from '@/components/profile/BudgetSheet'
import { useCurrency } from '@/lib/currency'
import { useUser } from '@/lib/user-context'
import { useCategories } from '@/lib/hooks/useCategories'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'
import { clearPin, lockNow } from '@/lib/pin'

export default function ProfilePage() {
  const router = useRouter()
  const { format, currency } = useCurrency()
  const { user, signOut, refresh: refreshUser } = useUser()
  const { categories, addCategory, updateCategory, removeCategory } = useCategories(user?.id)
  const { expenses } = useExpenses(user?.id)
  const stats = useDashboardStats(expenses, user?.monthly_budget ?? 0)
  const [openCats, setOpenCats] = useState(false)
  const [catInitialMode, setCatInitialMode] = useState<'list' | 'add'>('list')
  const [openBudget, setOpenBudget] = useState(false)
  const [signing, setSigning] = useState(false)

  const handleSignOut = async () => {
    if (signing) return
    setSigning(true)
    await signOut()
    router.replace('/auth')
  }

  const openManage = () => { setCatInitialMode('list'); setOpenCats(true) }
  const openAdd = () => { setCatInitialMode('add'); setOpenCats(true) }

  return (
    <AppShell>
      {/* Clean header — no back button, no title text */}
      <div style={{ height: 'max(24px, env(safe-area-inset-top))', background: '#EDE4D8' }} />

      <div style={{ paddingTop: 4 }}>
        <ProfileHeader
          name={user?.name ?? 'Guest'}
          email={user?.email ?? '—'}
          avatarUrl={user?.avatar_url}
        />

        <div style={{ margin: '0 20px 16px' }}>
          <p
            style={{
              fontSize: 12, color: '#65574A', fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
            }}
          >
            Currency
          </p>
          <CurrencyPicker variant="full" align="left" />
        </div>

        <SettingsCard
          title="Budget"
          items={[
            {
              icon: <Wallet size={18} color="#C9A830" strokeWidth={2} />,
              label: user?.monthly_budget ? 'Monthly Budget' : 'Set Monthly Budget',
              value: user?.monthly_budget ? format(user.monthly_budget, { decimals: 0 }) : 'Tap to set',
              onClick: () => setOpenBudget(true),
            },
            {
              icon: <TrendingDown size={18} color="#D07850" strokeWidth={2} />,
              label: 'This Month Spent',
              value: format(stats.totalSpent, { decimals: 0 }),
            },
            {
              icon: <PiggyBank size={18} color="#2C6A49" strokeWidth={2} />,
              label: 'Remaining',
              value: format(stats.totalRemaining, { decimals: 0 }),
            },
          ]}
        />

        <SettingsCard
          title="Bills"
          items={[
            {
              icon: <Users size={18} color="#5078A8" strokeWidth={2} />,
              label: 'Split Bills',
              onClick: () => router.push('/splits'),
            },
          ]}
        />

        <SettingsCard
          title="Categories"
          items={[
            {
              icon: <Tags size={18} color="#65574A" strokeWidth={2} />,
              label: `Manage Categories (${categories.length})`,
              onClick: openManage,
            },
            {
              icon: <Plus size={18} color="#D07850" strokeWidth={2} />,
              label: 'Add Category',
              onClick: openAdd,
            },
          ]}
        />

        <SettingsCard
          title="Security"
          items={[
            {
              icon: <KeyRound size={18} color="#65574A" strokeWidth={2} />,
              label: 'Change PIN',
              onClick: () => {
                if (!user) return
                clearPin(user.id)
                router.push('/pin?mode=set')
              },
            },
            {
              icon: <ShieldOff size={18} color="#D07850" strokeWidth={2} />,
              label: 'Lock Now',
              onClick: () => {
                if (!user) return
                lockNow(user.id)
                router.replace('/pin')
              },
            },
          ]}
        />

        <SettingsCard
          title="Account"
          items={[
            {
              icon: <LogOut size={18} color="#E84B4B" strokeWidth={2.4} />,
              label: signing ? 'Signing out...' : 'Logout',
              onClick: handleSignOut,
              danger: true,
            },
          ]}
        />

        <p style={{ textAlign: 'center', fontSize: 11, color: '#A8998A', padding: '8px 20px 24px' }}>
          SpendWise · {currency.code} ({currency.symbol})
        </p>
      </div>

      <BudgetSheet
        open={openBudget}
        onClose={() => setOpenBudget(false)}
        userId={user?.id}
        current={user?.monthly_budget ?? 0}
        onSaved={() => { refreshUser() }}
      />

      <CategoryManageSheet
        open={openCats}
        onClose={() => setOpenCats(false)}
        categories={categories}
        initialMode={catInitialMode}
        onAdd={async c => { await addCategory(c) }}
        onUpdate={async (id, p) => { await updateCategory(id, p) }}
        onRemove={async id => { await removeCategory(id) }}
      />
    </AppShell>
  )
}
