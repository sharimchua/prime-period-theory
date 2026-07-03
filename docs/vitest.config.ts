/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['components/src/**/*.ts', 'src/components/designer/**/*.ts'],
      exclude: ['**/*.d.ts', '**/index.ts'],
    },
  },
});
