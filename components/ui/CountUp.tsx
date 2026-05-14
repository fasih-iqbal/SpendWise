'use client'
import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

interface Props {
  to: number
  duration?: number
  decimals?: number
}

export function CountUp({ to, duration = 1, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
    })
    return () => controls.stop()
  }, [to, duration, decimals])

  return <span ref={ref}>0</span>
}
