import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PPTComponents',
      fileName: (format) => `ppt-components.${format}.js`,
    },
    rollupOptions: {
      // Ensure there are no external dependencies that need resolving
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
