import { rssSchema } from '@astrojs/rss'
import { defineCollection } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: rssSchema,
})

export const collections = { blog }
