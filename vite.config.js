import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/sheepshead-scorer/",
  plugins: [
    react(),
    VitePWA({
      // The app is played at a card table where signal is often poor, and all
      // state is local anyway, so everything is precached and served offline.
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-192.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Shorewood Sheepshead',
        short_name: 'Sheepshead',
        description: 'Scorekeeper for Sheepshead - pots, picks and payouts.',
        theme_color: '#1b4d3e',
        background_color: '#1b4d3e',
        display: 'standalone',
        orientation: 'portrait',
        // Must match Vite's base, or an installed app opens the wrong path.
        scope: '/sheepshead-scorer/',
        start_url: '/sheepshead-scorer/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
        // Single-page app: any navigation falls back to the cached shell.
        navigateFallback: '/sheepshead-scorer/index.html'
      }
    })
  ],
})
