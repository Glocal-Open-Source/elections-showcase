import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/showcase/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react:  ['react', 'react-dom'],
          motion: ['framer-motion'],
          icons:  [
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-brands-svg-icons',
          ],
        },
      },
    },
  },
})
