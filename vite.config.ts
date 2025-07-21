import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          gemini: ['@google/genai']
        }
      }
    }
  },
  define: {
    // Enable PWA features in production
    __PWA_ENABLED__: JSON.stringify(true)
  }
});
