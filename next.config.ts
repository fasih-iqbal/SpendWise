import type { NextConfig } from 'next'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Enable in all environments so local testing works offline too
  disable: false,
  // Serve the app shell from cache when offline
  fallbacks: {
    document: '/',
  },
  runtimeCaching: [
    {
      // Next.js static chunks — always cache first
      urlPattern: /^https?:\/\/.+\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Images
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Google Fonts
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      // Page navigations — network first, fall back to cache
      urlPattern: /^https?:\/\/.+\/(?:dashboard|transactions|analytics|profile|pin).*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 4,
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      // Supabase API — network first, short cache fallback
      urlPattern: /^https:\/\/.+\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
      },
    },
  ],
})

const nextConfig: NextConfig = {
  // next-pwa adds a webpack config; telling Next.js 16 that Turbopack
  // is intentional silences the build-breaking conflict warning.
  turbopack: {},
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
      ],
    },
  ],
}

export default withPWA(nextConfig)
