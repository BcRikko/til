import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Today I learned. | ダーシノ(@bc_rikko)',
    description: 'フロントエンド関連で今日学んだことを共有',
    site: context.site,
    trailingSlash: true,
    items: await pagesGlobToRssItems(
      import.meta.glob('./posts/**/*.{md,mdx}')
    ),
  })
}
