import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   optimizeDeps: {
    exclude: ["react-qr-scanner"]
  },
  build: {
    rollupOptions: {
      external: ["react-qr-scanner"]
    }
  }
})
