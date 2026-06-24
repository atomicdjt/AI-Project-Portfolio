import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite owns the development server, production bundle, and Vitest browser-like environment.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
});
