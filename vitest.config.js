import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',

    // 🔥 Fix worker crash issue
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },

    // optional stability boost
    testTimeout: 20000
  }
});