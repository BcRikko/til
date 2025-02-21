import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
  site: 'https://bcrikko.github.io',
  base: '/til',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    rehypePlugins: [
      (...args) => rehypeKatex({
        ...args,
        output: 'mathml',
        strict: false,
      }),
    ],
  },
})
