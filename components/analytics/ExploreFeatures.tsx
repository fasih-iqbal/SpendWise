'use client'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ExploreFeature } from '@/lib/types'

interface Props {
  features: ExploreFeature[]
}

export function ExploreFeatures({ features }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ padding: '0 20px', fontWeight: 700, fontSize: 15, color: '#1A1410', marginBottom: 12 }}>
        Explore Features
      </p>
      <div
        className="scrollbar-none"
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          padding: '0 20px 6px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {features.map((feat, i) => (
          <motion.div
            key={feat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              flexShrink: 0,
              width: 180,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 18,
              padding: 14,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: feat.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: feat.iconColor,
              }}
            >
              {feat.icon}
            </div>

            <p style={{ fontWeight: 700, fontSize: 13, color: '#1A1410', lineHeight: 1.25, whiteSpace: 'pre-line' }}>
              {feat.title}
            </p>

            <p style={{ fontSize: 11, color: '#65574A', lineHeight: 1.45, flex: 1 }}>
              {feat.body}
            </p>

            {feat.cta && (
              <button
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: feat.iconColor,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {feat.cta} <ArrowRight size={12} />
              </button>
            )}

            {feat.offer && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#1A1410',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: 999,
                }}
              >
                {feat.offer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
