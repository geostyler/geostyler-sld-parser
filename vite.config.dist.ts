import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/SldStyleParser.ts'),
      formats: ['es'],
      fileName: 'SldStyleParser',
    },
    rollupOptions: {
      external: ['geostyler-style', 'fast-xml-parser'],
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        externalLiveBindings: false,
      },
    },
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
  },
});
