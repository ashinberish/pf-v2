// Renders the app to static HTML after `vite build` so crawlers get real content,
// then writes robots.txt and sitemap.xml for the configured site URL.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { loadEnv } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const siteUrl = loadEnv('production', root, '').VITE_SITE_URL.replace(/\/$/, '')

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)
const indexPath = path.join(dist, 'index.html')
const template = await fs.readFile(indexPath, 'utf8')
if (!template.includes('<!--app-html-->')) throw new Error('index.html is missing the <!--app-html--> placeholder')
await fs.writeFile(indexPath, template.replace('<!--app-html-->', render()))

await fs.writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
)
await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered dist/index.html, robots.txt and sitemap.xml for ${siteUrl}`)
