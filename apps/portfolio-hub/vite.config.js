import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.GITHUB_PAGES ? './' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
  },
});
