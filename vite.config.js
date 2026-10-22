import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: o build funciona em qualquer subpasta (ex.: GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: './',
  // ponytail: as ~45 mil palavras das fichas vão no bundle (≈230 KB gzip); se crescer muito,
  // carregar src/data/autores/*.json sob demanda com import.meta.glob sem `eager`.
  build: { chunkSizeWarningLimit: 900 },
});
