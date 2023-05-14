/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import { comlink } from 'vite-plugin-comlink'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/demo-react',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    wasm(),
    comlink(),
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
  ],

  // Uncomment this if you are using workers.
  worker: {
    format: 'es',
    plugins: [
      wasm(),
      comlink(),
      viteTsConfigPaths({
        root: '../../',
      }),
    ],
  },

  define: {
    'import.meta.vitest': undefined,
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
