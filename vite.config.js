// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/', // use './' only if deploying to subdirectory
  publicDir: 'public', // default, ensure assets are here
  build: {
    outDir: 'dist'
  }
})
