import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import rehypeMermaid from 'rehype-mermaid'

// https://astro.build/config
export default defineConfig({
  site: 'https://bcrikko.github.io',
  base: '/til',
  integrations: [
    mdx(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
    },
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
    rehypePlugins: [
      (...args) => rehypeKatex({
        ...args,
        output: 'mathml',
        strict: false,
      }),
      rehypeMermaid,
    ],
  },
})
