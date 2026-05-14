'use client'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { SettingsCard } from '@/components/profile/SettingsCard'
import { CurrencyPicker } from '@/components/ui/CurrencyPicker'
import { useCurrency } from '@/lib/currency'
import { MOCK_USER, MOCK_DASHBOARD } from '@/lib/mock-data'

export default function ProfilePage() {
  const { format, currency } = useCurrency()

  return (
    <AppShell>
      <Header userName={MOCK_USER.name} />
      <div style={{ paddingTop: 4 }}>
        <ProfileHeader name={MOCK_USER.card_holder} email={MOCK_USER.email} />

        <div style={{ margin: '0 20px 16px' }}>
          <p
            style={{
              fontSize: 12,
              color: '#65574A',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Currency
          </p>
          <CurrencyPicker variant="full" align="left" />
        </div>

        <SettingsCard
          title="Budget"
          items={[
            { icon: '💰', label: 'Monthly Budget', value: format(MOCK_USER.total_budget, { decimals: 0 }) },
            { icon: '📈', label: 'This Month Spent', value: format(MOCK_DASHBOARD.totalSpent, { decimals: 0 }) },
            { icon: '🎯', label: 'Remaining', value: format(MOCK_DASHBOARD.totalRemaining, { decimals: 0 }) },
          ]}
        />

        <SettingsCard
          title="Categories"
          items={[
            { icon: '🏷️', label: 'Manage Categories', onClick: () => {} },
            { icon: '➕', label: 'Add Category', onClick: () => {} },
          ]}
        />

        <SettingsCard
          title="Notifications"
          items={[
            { icon: '🔔', label: 'Budget Alert (80%)', value: 'On' },
            { icon: '⚠️', label: 'Budget Exceeded', value: 'On' },
            { icon: '📊', label: 'Weekly Summary', value: 'Off' },
          ]}
        />

        <SettingsCard
          title="Data"
          items={[
            { icon: '📤', label: 'Export CSV', onClick: () => {} },
            { icon: '🖨️', label: 'Export PDF', onClick: () => {} },
          ]}
        />

        <SettingsCard
          title="Account"
          items={[
            { icon: '🚪', label: 'Sign Out', onClick: () => {}, danger: true },
          ]}
        />

        <p style={{ textAlign: 'center', fontSize: 11, color: '#A8998A', padding: '8px 20px 24px' }}>
          SpendWise · Currency: {currency.code} ({currency.symbol})
        </p>
      </div>
    </AppShell>
  )
}
