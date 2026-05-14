'use client'
import { motion } from 'framer-motion'

export function SketchGrid() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        maxWidth: 340,
        margin: '0 auto',
      }}
    >
      <svg
        viewBox="0 0 340 340"
        style={{ width: '100%', height: '100%' }}
        aria-hidden
      >
        <defs>
          <path
            id="compassCircleTop"
            d="M 60,60 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
          <path
            id="compassCircleBottom"
            d="M 280,280 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
        </defs>

        {/* Outer rect */}
        <rect x="6" y="6" width="328" height="328" rx="4" fill="none" stroke="#1A1410" strokeWidth="1" />
        {/* Grid lines */}
        <line x1="170" y1="6" x2="170" y2="334" stroke="#1A1410" strokeWidth="1" />
        <line x1="6" y1="170" x2="334" y2="170" stroke="#1A1410" strokeWidth="1" />

        {/* === TL: Compass with circular text === */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Compass star */}
          <g transform="translate(60 60)">
            <circle r="20" fill="none" stroke="#1A1410" strokeWidth="1" />
            <path d="M 0,-22 L 4,0 L 0,22 L -4,0 Z" fill="#1A1410" />
            <path d="M -22,0 L 0,-4 L 22,0 L 0,4 Z" fill="#1A1410" />
            <path d="M 14,-14 L 4,-2 L 2,-12 Z" fill="#65574A" opacity="0.6" />
            <path d="M -14,14 L -2,4 L -12,2 Z" fill="#65574A" opacity="0.6" />
          </g>
          <text fontFamily="var(--font-urbanist), sans-serif" fontSize="9" fill="#1A1410" letterSpacing="0.18em">
            <textPath href="#compassCircleTop" startOffset="0">
              SPEND SMART · SAVE MORE · BUDGET PLAN ·
            </textPath>
          </text>
        </motion.g>

        {/* === TR: wavy lines + label === */}
        <motion.g
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <path d="M 195 50 Q 230 35, 260 55 T 320 50" stroke="#D07850" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 195 75 Q 235 60, 265 80 T 320 75" stroke="#C9A830" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 195 100 Q 230 85, 260 105 T 320 100" stroke="#2C6A49" strokeWidth="2" fill="none" strokeLinecap="round" />
          <text x="260" y="130" fontFamily="var(--font-urbanist), sans-serif" fontSize="13" fontWeight="700" fill="#1A1410">
            -1200$
          </text>
          <text x="260" y="146" fontFamily="var(--font-urbanist), sans-serif" fontSize="10" fill="#A8998A">
            Expense
          </text>
        </motion.g>

        {/* === BL: small wavy lines === */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <path d="M 30 200 Q 60 185, 90 205 T 150 200" stroke="#7F5EA8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 30 226 Q 65 213, 95 232 T 150 224" stroke="#5078A8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* === BR: Compass with text === */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <g transform="translate(280 280)">
            <circle r="20" fill="none" stroke="#1A1410" strokeWidth="1" />
            <path d="M 0,-22 L 4,0 L 0,22 L -4,0 Z" fill="#1A1410" />
            <path d="M -22,0 L 0,-4 L 22,0 L 0,4 Z" fill="#1A1410" />
            <path d="M 14,-14 L 4,-2 L 2,-12 Z" fill="#65574A" opacity="0.6" />
            <path d="M -14,14 L -2,4 L -12,2 Z" fill="#65574A" opacity="0.6" />
          </g>
          <text fontFamily="var(--font-urbanist), sans-serif" fontSize="9" fill="#1A1410" letterSpacing="0.18em">
            <textPath href="#compassCircleBottom" startOffset="0">
              SPEND SMART · SAVE MORE · BUDGET PLAN ·
            </textPath>
          </text>
        </motion.g>

        {/* === Center brand phrase + curve === */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <path
            d="M 30 175 Q 90 150, 150 180 T 280 180"
            stroke="#1A1410"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="155" cy="178" r="5" fill="#D07850" stroke="#fff" strokeWidth="2" />
          <text x="38" y="165" fontFamily="var(--font-urbanist), sans-serif" fontSize="22" fontWeight="800" fill="#D07850">
            Keep Expense
          </text>
          <text x="170" y="208" fontFamily="var(--font-urbanist), sans-serif" fontSize="22" fontWeight="800" fill="#2C6A49">
            Crystal Clear
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
