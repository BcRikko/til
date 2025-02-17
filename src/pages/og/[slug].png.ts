import type { APIRoute, GetStaticPaths, GetStaticPathsItem, MDXInstance } from "astro";
import { createCanvas, loadImage } from "canvas"
import fs from "node:fs"
import path from "node:path"

async function getOgImage(title: string): Promise<Buffer> {
  const size = { w: 800, h: 418 } as const

  const canvas = createCanvas(size.w, size.h)
  const ctx = canvas.getContext('2d')
  const src = path.resolve(process.cwd(), 'src/pages/og/_ogimage.png')
  const img = await loadImage(fs.readFileSync(src))
  
  ctx.drawImage(img, 0, 0, size.w, size.h)

  const fontSize = 48 as const
  ctx.font = `${fontSize}px`
  ctx.fillStyle = '#333'
  
  const padding = 60 as const
  let top = 200 as const

  const maxWidth = size.w - padding * 2
  
  const words = title.split('')
  let line = ''

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i]
    const testWidth = ctx.measureText(testLine).width
    if (testWidth > maxWidth) {
      ctx.fillText(line, padding, top)
      line = words[i]
      top += fontSize + 20
    } else {
      line = testLine
    }
  }

  ctx.fillText(line, padding, top)

  return canvas.toBuffer('image/png')
}

function getOgImageAPI(): {
  getStaticPaths: GetStaticPaths
  GET: APIRoute
} {
  const allPosts: MDXInstance<MyPost>[] = Object.values(
    import.meta.glob(["../posts/**/*.{md,mdx}", "!../posts/**/_*.{md,mdx}"], {
      eager: true,
    }),
  );
  
  return {
    getStaticPaths: async () => {
      return allPosts.map((post, i) => {
        const path = post.url?.split('/').pop()
        const slug = `${post.frontmatter.pubDate}&${path}`
        return {
          params: { slug },
        };
      })
    },
    GET: async ({ params }) => {
      const slug = params.slug
      if (slug === undefined) {
        return new Response('Not Found', { status: 404 })
      }

      // NOTE: slug = /og/[pubDate]&[path].png
      const [pubDate, path] = slug.split('&')
      const post = allPosts.find(a => a.frontmatter.pubDate === pubDate && a.url?.split('/').pop() === path)

      if (post === undefined) {
        return new Response('Not Found', {
          status: 404,
        })
      }

      return new Response(
        await getOgImage(post.frontmatter.title),
        {
          headers: {
            'content-type': 'image/png',
          }
        }
      )
    }
  }
}

export const { getStaticPaths, GET } = getOgImageAPI();
