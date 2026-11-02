// Guide and Q&A pages are markdown files with front matter under
// content/<destination>/. Only `status: reviewed` entries with at least one
// source are published (filtered in src/lib/content.ts and enforced again by
// scripts/check-content.mjs before every build).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const source = z.object({ url: z.string().url(), label: z.string().min(1) });

const common = {
  title: z.string().min(1),
  description: z.string().min(1),
  sources: z.array(source).default([]),
  published: z.coerce.date(),
  reviewed: z.coerce.date(),
  status: z.enum(['draft', 'reviewed']),
  order: z.number().default(100),
  // Key into content/antarctica/data/images.json
  image: z.string().optional(),
};

const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/antarctica/guide' }),
  schema: z.object({
    ...common,
    // Optional signature feature to render inside the page.
    feature: z.enum(['season-chart', 'route-table']).optional(),
    // Places mentioned, by key in content/antarctica/data/places.json
    places: z.array(z.string()).default([]),
  }),
});

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/antarctica/questions' }),
  schema: z.object({
    ...common,
    // The short answer shown first, and used as the FAQPage acceptedAnswer lead.
    answer: z.string().min(1),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { guide, questions };
