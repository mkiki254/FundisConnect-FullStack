import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const django = 'http://127.0.0.1:8000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // import client from '@/api' works from any folder depth
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    // In development, forward these paths to Django so the browser sees a single address
    proxy: {
      '/api': django,
      '/admin': django,
      '/media': django,
      '/static': django,
    },
  },
})