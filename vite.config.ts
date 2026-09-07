/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Deployed to GitHub Pages at https://<user>.github.io/ravi-mausaji/
// so assets must resolve under the /ravi-mausaji/ base path.
// https://vite.dev/config/
export default defineConfig({
  base: '/ravi-mausaji/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
