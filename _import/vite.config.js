// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',         // <-- auto update SW
      workbox: {
        clientsClaim: true,               // take control immediately
        skipWaiting: true                 // activate new SW without waiting
      },
      // keep your own manifest file in /public; this block optional
      // manifest: undefined,
      includeAssets: [
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/icon-512x512-maskable.png'
      ]
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  }
})
