import fs from 'node:fs'
import path from 'node:path'

// Minimal .env.local loader for the esbuild script, which runs outside of
// Next.js's own env handling. Mirrors what Next.js would load for the app.
export function loadEnvLocal(dir) {
  const file = path.join(dir, '.env.local')
  if (!fs.existsSync(file)) return

  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}
