import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dark-descent-roguelike/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
});
