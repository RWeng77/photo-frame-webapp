import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/photo-frame-webapp/',  
  plugins: [react()],
});

