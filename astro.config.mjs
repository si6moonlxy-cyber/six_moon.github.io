import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkObsidian } from './src/lib/remark-obsidian.mjs';

export default defineConfig({
  site: 'https://six_moon.github.io',
  base: '/',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
  build: {
    format: 'directory',
  },
});
