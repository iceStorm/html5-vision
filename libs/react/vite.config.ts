/// <reference types="vitest" />

import { join } from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

import wasm from 'vite-plugin-wasm'
import { comlink } from 'vite-plugin-comlink'
import { fileURLToPath } from 'url'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/react',

  plugins: [
    wasm(),
    comlink(),
    dts({
      entryRoot: 'src',
      tsConfigFilePath: join(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),
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

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    cssCodeSplit: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: {
        'hv-index': 'src/index.ts',
        'hv-menus': 'src/menus',
      },
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        // framework
        'react',
        'react-dom',
        'react/jsx-runtime',

        // third parties
        'immer',
        'lodash',
        'zustand',
        'framer-motion',
      ],
    },
  },

  resolve: {
    alias: [
      {
        find: '~',
        replacement: fileURLToPath(new URL('./src/lib', import.meta.url)),
      },
      {
        find: '~store',
        replacement: fileURLToPath(new URL('./src/lib/store', import.meta.url)),
      },
      {
        find: '~utils',
        replacement: fileURLToPath(new URL('./src/lib/utils', import.meta.url)),
      },
      // {
      //   find: '~menus',
      //   replacement: fileURLToPath(new URL('./src/lib/menus', import.meta.url)),
      // },
      {
        find: '~models',
        replacement: fileURLToPath(new URL('./src/lib/models', import.meta.url)),
      },
      {
        find: '~assets',
        replacement: fileURLToPath(new URL('./src/lib/assets', import.meta.url)),
      },
    ],
  },
})
