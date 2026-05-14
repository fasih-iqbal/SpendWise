'use client'
import { motion } from 'framer-motion'

interface Props {
  percentage: number
  size?: number
  strokeWidth?: number
}

export function ProgressRing({ percentage, size = 110, strokeWidth = 10 }: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B6EF5" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="#1e2540"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 22,
            lineHeight: 1,
            color: 'rgb(var(--text-1))',
          }}
        >
          {percentage}%
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm)',
            fontSize: 10,
            color: 'rgb(var(--text-3))',
            marginTop: 2,
          }}
        >
          used
        </span>
      </div>
    </div>
  )
}
