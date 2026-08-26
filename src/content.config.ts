import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./content/sources",
    pattern: [
      "**/posts/**/*.{md,mdx}",
      "!**/posts/AGENTS.md",
      "!**/posts/README.md",
      "!**/posts/reviews/**",
      "!**/posts/source-notes/**",
    ],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    tags: z.array(z.string()).default([]),
    author: z.string(),
    draft: z.boolean().default(false),
  }),
});

const changelog = defineCollection({
  loader: glob({
    base: "./content/changelog",
    pattern: ["**/*.{md,mdx}", "!README.md"],
  }),
  schema: z.object({
    title: z.string().min(1).max(100),
    summary: z.string().min(1).max(360),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    link: z.object({
      label: z.string().min(1).max(60),
      href: z.string().url(),
    }).optional(),
  }),
});

export const collections = { posts, changelog };
