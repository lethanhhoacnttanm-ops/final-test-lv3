import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/teachers': 'http://localhost:8080',
      '/teacher-positions': 'http://localhost:8080'
    }
  }
})
