import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://six_moon.github.io',
  base: '/',
  integrations: [mdx()],
  build: {
    format: 'directory',
  },
});
