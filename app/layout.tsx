import type { Metadata, Viewport } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
})

export const metadata: Metadata = {
  title: 'SpendWise — Budget Tracker',
  description: 'Track your expenses, set budgets, and reach your financial goals.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpendWise',
  },
  icons: {
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192' },
      { url: '/icons/icon-512.png', sizes: '512x512' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#080B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="spendwise-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
