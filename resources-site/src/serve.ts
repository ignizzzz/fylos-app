/**
 * A minimal zero-dependency static server for previewing the built site. It
 * resolves directory-style clean URLs (e.g. /resources/ -> resources/index.html)
 * and serves the generated 404.html with a real 404 status. Preview only, not a
 * production server (the output is plain static files).
 *
 *   npm run preview           # serves ./dist on PORT (default 4655)
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = join(here, '..', 'dist')
const distRoot = distDir + sep
const port = Number(process.env.PORT ?? 4655)

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
}

async function existsFile(path: string): Promise<boolean> {
  try {
    const s = await stat(path)
    return s.isFile()
  } catch {
    return false
  }
}

function candidatesFor(pathname: string): string[] {
  const rel = decodeURIComponent(pathname)
  if (rel.endsWith('/')) return [join(distDir, rel, 'index.html')]
  if (extname(rel)) return [join(distDir, rel)]
  return [join(distDir, `${rel}.html`), join(distDir, rel, 'index.html')]
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`)
  const candidates = candidatesFor(url.pathname)

  for (const candidate of candidates) {
    // Guard against path traversal outside dist. Require the normalized path to
    // be dist itself or sit under dist + separator, so sibling directories that
    // merely share the "dist" prefix (dist2, distdata, ...) cannot be reached.
    const safe = normalize(candidate)
    if (safe !== distDir && !safe.startsWith(distRoot)) continue
    if (await existsFile(safe)) {
      const body = await readFile(safe)
      res.writeHead(200, { 'content-type': MIME[extname(safe)] ?? 'application/octet-stream' })
      res.end(body)
      return
    }
  }

  const notFound = join(distDir, '404.html')
  if (await existsFile(notFound)) {
    const body = await readFile(notFound)
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end(body)
    return
  }
  res.writeHead(404, { 'content-type': 'text/plain' })
  res.end('Not found')
})

server.listen(port, () => {
  console.log(`Preview: http://localhost:${port}/resources/`)
})
