import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type Result = {
  title: string
  slug: string
  excerpt?: string
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').toLowerCase().trim()

    if (!q) return NextResponse.json([])

    const postsDir = path.join(process.cwd(), 'content', 'posts')
    const files = fs.readdirSync(postsDir)

    const results: Result[] = []

    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue
      const full = path.join(postsDir, file)
      const raw = fs.readFileSync(full, 'utf8')

      // parse frontmatter with gray-matter
      const { data, content } = matter(raw)

      // search in both frontmatter and content
      const searchText = (JSON.stringify(data) + ' ' + content).toLowerCase()
      if (!searchText.includes(q)) continue

      // derive slug from filename
      const slug = file.replace(/\.mdx?$/, '')

      // extract title from frontmatter or fall back to slug
      const title = (data.title as string) || slug

      // extract excerpt from frontmatter (description/summary) or generate from content
      let excerpt = data.description || data.summary || data.excerpt
      if (!excerpt) {
        // generate excerpt from content: take 120 chars surrounding first match
        const idx = content.toLowerCase().indexOf(q)
        if (idx !== -1) {
          const start = Math.max(0, idx - 40)
          excerpt = content.substring(start, Math.min(content.length, idx + q.length + 60)).replace(/\n/g, ' ')
        }
      }

      results.push({ title, slug, excerpt })
    }

    // simple scoring: shorter excerpt first (rough relevance)
    results.sort((a, b) => (a.excerpt?.length || 0) - (b.excerpt?.length || 0))

    return NextResponse.json(results.slice(0, 10))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Search API error', err)
    return NextResponse.json([], { status: 500 })
  }
}
