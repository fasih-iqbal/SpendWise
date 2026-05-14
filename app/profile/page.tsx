'use client'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { SettingsCard } from '@/components/profile/SettingsCard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function ProfilePage() {
  return (
    <AppShell>
      <Header userName="Alex" />
      <div style={{ paddingTop: 8 }}>
        <ProfileHeader name="Alex Johnson" email="fasihiqbal56@gmail.com" />

        <SettingsCard
          title="Budget"
          items={[
            { icon: '💰', label: 'Monthly Budget', value: '$3,500' },
            { icon: '📅', label: 'Current Month', value: 'May 2025' },
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

        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20 }}>
          <ThemeToggle />
        </div>
      </div>
    </AppShell>
  )
}
