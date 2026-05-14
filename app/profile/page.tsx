'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, LogOut } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { SettingsCard } from '@/components/profile/SettingsCard'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'
import { CategoryManageSheet } from '@/components/profile/CategoryManageSheet'
import { useCurrency } from '@/lib/currency'
import { useUser } from '@/lib/user-context'
import { useCategories } from '@/lib/hooks/useCategories'
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useDashboardStats } from '@/lib/hooks/useDashboardStats'
import { clearPin, lockNow } from '@/lib/pin'

export default function ProfilePage() {
  const router = useRouter()
  const { format, currency } = useCurrency()
  const { user, signOut } = useUser()
  const { categories, addCategory, updateCategory, removeCategory } = useCategories(user?.id)
  const { expenses } = useExpenses(user?.id)
  const stats = useDashboardStats(expenses, user?.monthly_budget ?? 0)
  const [openCats, setOpenCats] = useState(false)
  const [signing, setSigning] = useState(false)

  const handleSignOut = async () => {
    if (signing) return
    setSigning(true)
    await signOut()
    router.replace('/auth')
  }

  return (
    <AppShell>
      {/* Minimal profile-only header (no greeting / no currency / no avatar — already on page) */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 20px 8px',
          background: '#EDE4D8',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#1A1410" />
        </button>
        <h1 style={{ flex: 1, fontWeight: 700, fontSize: 20, color: '#1A1410' }}>
          Profile
        </h1>
      </header>

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
            { icon: '💰', label: 'Monthly Budget', value: format(user?.monthly_budget ?? 0, { decimals: 0 }) },
            { icon: '📈', label: 'This Month Spent', value: format(stats.totalSpent, { decimals: 0 }) },
            { icon: '🎯', label: 'Remaining', value: format(stats.totalRemaining, { decimals: 0 }) },
          ]}
        />

        <SettingsCard
          title="Categories"
          items={[
            { icon: '🏷️', label: `Manage Categories (${categories.length})`, onClick: () => setOpenCats(true) },
            { icon: '➕', label: 'Add Category', onClick: () => setOpenCats(true) },
          ]}
        />

        <SettingsCard
          title="Security"
          items={[
            {
              icon: '🔒',
              label: 'Change PIN',
              onClick: () => {
                if (!user) return
                clearPin(user.id)
                router.push('/pin?mode=set')
              },
            },
            {
              icon: '🔐',
              label: 'Lock now',
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

      <CategoryManageSheet
        open={openCats}
        onClose={() => setOpenCats(false)}
        categories={categories}
        onAdd={async c => { await addCategory(c) }}
        onUpdate={async (id, p) => { await updateCategory(id, p) }}
        onRemove={async id => { await removeCategory(id) }}
      />
    </AppShell>
  )
}
