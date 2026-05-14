'use client'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bell } from 'lucide-react'
import { getGreeting, getGreetingEmoji } from '@/lib/utils'

interface Props {
  userName?: string
}

export function Header({ userName = 'there' }: Props) {
  return (
    <header
      className="flex items-center justify-between px-5 pt-6 pb-4"
      style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgb(var(--bg-primary))' }}
    >
      <div>
        <p
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 12,
            color: 'rgb(var(--text-3))',
          }}
        >
          {getGreeting()} {getGreetingEmoji()}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 700,
            fontSize: 20,
            color: 'rgb(var(--text-1))',
          }}
        >
          {userName}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'rgb(var(--bg-card))',
            border: '1px solid rgba(var(--border), 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Notifications"
        >
          <Bell size={16} color="rgb(var(--text-2))" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
