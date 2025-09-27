import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/screens': path.resolve(__dirname, './screens'),
      '@/styles': path.resolve(__dirname, './styles')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0' // Permet l'accès depuis le réseau local pour tester sur mobile
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'sonner']
        }
      }
    }
  },
  // Configuration spécifique pour Capacitor
  define: {
    global: 'globalThis'
  }
})