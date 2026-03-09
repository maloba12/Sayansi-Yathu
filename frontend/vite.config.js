import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',  // Use current directory as root
  publicDir: 'public',  // Static files
  server: {
    port: 3001,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
