import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  //  Without this, `svelte` resolves to its server build and `mount()` throws under vitest.
  resolve: process.env.VITEST !== undefined ? { conditions: ['browser'] } : {},
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
