'use client'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center px-1 transition-colors duration-300"
      style={{
        width: 52,
        height: 28,
        borderRadius: 999,
        background: isDark ? 'rgba(91,110,245,0.25)' : 'rgba(232,184,109,0.25)',
        border: isDark ? '1px solid rgba(91,110,245,0.4)' : '1px solid rgba(232,184,109,0.5)',
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="flex items-center justify-center text-[11px]"
        animate={{ x: isDark ? 0 : 24 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: isDark ? '#5B6EF5' : '#E8B86D',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </button>
  )
}
