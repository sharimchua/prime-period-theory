// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkRewriteOkfLinks } from './src/plugins/remark-rewrite-okf-links.js';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkRewriteOkfLinks]
  }
});