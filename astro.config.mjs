import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkObsidian } from './src/lib/remark/index.mjs';

export default defineConfig({
  site: 'https://20090711.xyz' ,
  base: '/',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkObsidian],
  },
  build: {
    format: 'directory',
  },
});
