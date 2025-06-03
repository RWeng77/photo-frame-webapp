import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/photo-frame-webapp/',  // <-- 這行是關鍵
  plugins: [react()],
});

