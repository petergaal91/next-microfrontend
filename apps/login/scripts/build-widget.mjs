import * as esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnvLocal } from './load-env.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const watch = process.argv.includes('--watch')

loadEnvLocal(rootDir)

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [path.join(rootDir, 'widget/index.jsx')],
  bundle: true,
  outfile: path.join(rootDir, 'public/login-widget.js'),
  format: 'iife',
  target: 'es2018',
  jsx: 'automatic',
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.STRIVACITY_ISSUER': JSON.stringify(process.env.STRIVACITY_ISSUER || ''),
    'process.env.STRIVACITY_CLIENT_ID': JSON.stringify(process.env.STRIVACITY_CLIENT_ID || ''),
    'process.env.STRIVACITY_REDIRECT_URI': JSON.stringify(process.env.STRIVACITY_REDIRECT_URI || ''),
    'process.env.STRIVACITY_SCOPES': JSON.stringify(process.env.STRIVACITY_SCOPES || ''),
  },
}

if (watch) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('[login] watching widget bundle for changes...')
} else {
  await esbuild.build(options)
  console.log('[login] widget bundle built -> public/login-widget.js')
}
