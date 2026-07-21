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
    status: z.string().optional(),
    domain: z.string().optional(),
    depends_on: z.array(z.string()).optional(),
    extends: z.array(z.string()).optional(),
    contrasts_with: z.array(z.string()).optional(),
    used_by: z.array(z.string()).optional(),
    implemented_by: z.array(z.string()).optional(),
    defines: z.array(z.string()).optional(),
    evidence: z.array(z.string()).optional(),
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
