import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reference = defineCollection({
  loader: glob({ pattern: '**/!(*AGENTS).md', base: '../okf' }),
  schema: z.object({
    type: z.string(),
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    timestamp: z.union([z.string(), z.date()]).optional(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/!(*README).{md,mdx}', base: './src/content/generated_topics' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { reference, topics };
