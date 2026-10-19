import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'motion/react',
      'lenis',
      'gsap',
    ],
  },
  server: {
    port: 5176,
    strictPort: false,
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  },
})
