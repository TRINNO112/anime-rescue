import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/anime-rescue/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  }
});
