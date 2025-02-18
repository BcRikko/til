import type { APIRoute, GetStaticPaths, MDXInstance } from "astro";
import { createCanvas, loadImage, registerFont } from "canvas"
import fs from "node:fs"
import path from "node:path"

const FONT = path.resolve(process.cwd(), 'public/NotoSansJP-Bold.ttf')
const FONT_FAMILY = 'Noto Sans JP' as const
const COLOR = '#333' as const
const CANVAS_SIZE = { w: 800, h: 418 } as const
const FONT_SIZE = 48 as const
const PADDING = 60 as const
const IMAGE_TEMPLATE = path.resolve(process.cwd(), 'src/pages/og/_ogimage.png')

async function getOgImage(title: string): Promise<Buffer> {
  const font = path.resolve(process.cwd(), FONT)
  registerFont(font, { family: FONT_FAMILY, weight: 'bold' })

  const canvas = createCanvas(CANVAS_SIZE.w, CANVAS_SIZE.h)
  const ctx = canvas.getContext('2d')

  try {
    ctx.save()
    const img = await loadImage(fs.readFileSync(IMAGE_TEMPLATE))
    ctx.drawImage(img, 0, 0, CANVAS_SIZE.w, CANVAS_SIZE.h)
  
    ctx.font = `${FONT_SIZE}px "${FONT_FAMILY}"`
    ctx.fillStyle = COLOR
  
    const maxWidth = CANVAS_SIZE.w - PADDING * 2
    
    let line = ''
    let top = 200
  
    for (const word of title.split('')) {
      const testLine = line + word
      const testWidth = ctx.measureText(testLine).width
      if (testWidth > maxWidth) {
        ctx.fillText(line, PADDING, top)
        line = word
        top += FONT_SIZE + 20
      } else {
        line = testLine
      }
    }
  
    ctx.fillText(line, PADDING, top)
  } finally {
    ctx.restore()
  }


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

      const imageBuffer = await getOgImage(post.frontmatter.title)
      return new Response(
        imageBuffer,
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
