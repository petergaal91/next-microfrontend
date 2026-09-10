import * as esbuild from 'esbuild'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const watch = process.argv.includes('--watch')

/** @type {import('esbuild').BuildOptions} */
const options = {
  entryPoints: [path.join(__dirname, '../widget/index.jsx')],
  bundle: true,
  outfile: path.join(__dirname, '../public/cart-widget.js'),
  format: 'iife',
  target: 'es2018',
  jsx: 'automatic',
  sourcemap: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
}

if (watch) {
  const ctx = await esbuild.context(options)
  await ctx.watch()
  console.log('[cart] watching widget bundle for changes...')
} else {
  await esbuild.build(options)
  console.log('[cart] widget bundle built -> public/cart-widget.js')
}
