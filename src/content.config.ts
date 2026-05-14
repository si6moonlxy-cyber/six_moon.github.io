import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BLOG_TAGS } from './lib/tags';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.enum(BLOG_TAGS)).default([]),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/[!()]*.md',
  }),
  schema: blogSchema,
});

export const collections = { blog };
