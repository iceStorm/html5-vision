/// <reference types="vitest" />

import { join } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

import wasm from 'vite-plugin-wasm';
import { comlink } from 'vite-plugin-comlink';

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
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'react',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
