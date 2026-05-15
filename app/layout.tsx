import type { Metadata, Viewport } from 'next'
import { Urbanist } from 'next/font/google'
import { CurrencyProvider } from '@/lib/currency'
import { UserProvider } from '@/lib/user-context'
import './globals.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
})

export const metadata: Metadata = {
  title: 'SpendWise — Budget Tracker',
  description: 'Track your expenses, set budgets, and reach your financial goals.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'SpendWise' },
  icons: {
    icon: [
      { url: '/icons/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/logo-192.png', sizes: '180x180' },
      { url: '/icons/logo-192.png', sizes: '192x192' },
      { url: '/icons/logo-512.png', sizes: '512x512' },
    ],
    shortcut: [{ url: '/icons/logo-192.png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#EDE4D8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#EDE4D8' }}>
      <body
        className={urbanist.variable}
        style={{
          fontFamily: 'var(--font-urbanist), sans-serif',
          background: '#EDE4D8',
          minHeight: '100vh',
        }}
      >
        <CurrencyProvider>
          <UserProvider>{children}</UserProvider>
        </CurrencyProvider>
      </body>
    </html>
  )
}
