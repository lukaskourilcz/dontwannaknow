import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const rootDir = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(rootDir, 'src/data')
const SETTINGS_FILE = resolve(rootDir, 'src/config/gameSettings.json')

// Map a content key from the /dev editor to a file on disk. `settings` is the
// game-config file; every other key is a JSON dataset in src/data. The regex +
// prefix check keep this from being tricked into reading/writing outside those.
function resolveContentFile(key: string): string | null {
  if (key === 'settings') return SETTINGS_FILE
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(key)) return null
  const file = resolve(DATA_DIR, `${key}.json`)
  return file.startsWith(DATA_DIR) ? file : null
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolveBody(data))
    req.on('error', reject)
  })
}

// Dev-only REST endpoint so the /dev editor can read and write the JSON
// content + settings files directly on disk. Not present in production builds
// (the editor falls back to read-only + download there).
function devContentApi(): Plugin {
  return {
    name: 'dwk-dev-content-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url ?? ''
        if (!url.startsWith('/__content/')) return next()

        const key = decodeURIComponent(url.slice('/__content/'.length).split('?')[0])
        const file = resolveContentFile(key)
        if (!file) {
          res.statusCode = 400
          res.end('Invalid content key')
          return
        }

        // Marker so the client can tell a real dev-API response apart from a
        // production SPA rewrite (which would also return 200).
        res.setHeader('x-dwk-dev', '1')
        res.setHeader('Content-Type', 'application/json')
        try {
          if (req.method === 'GET') {
            const text = await readFile(file, 'utf8').catch(() => 'null')
            res.end(text)
            return
          }
          if (req.method === 'POST' || req.method === 'PUT') {
            const body = await readBody(req)
            JSON.parse(body) // reject malformed payloads before writing
            await writeFile(file, body.endsWith('\n') ? body : body + '\n', 'utf8')
            res.end(JSON.stringify({ ok: true }))
            return
          }
          res.statusCode = 405
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ ok: false, error: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devContentApi()],
})
