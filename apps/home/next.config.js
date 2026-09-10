/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // "home" is the default zone (Next.js Multi-Zones): it owns "/" and
  // proxies everything under /products to the standalone "products" app,
  // so the browser only ever sees one origin (this one).
  async rewrites() {
    return [
      { source: '/products', destination: 'http://localhost:3001/products' },
      { source: '/products/:path*', destination: 'http://localhost:3001/products/:path*' },
      // The login app's own pages (callback, session-resume login) live
      // under /auth so this reaches Strivacity's redirectUri.
      { source: '/auth', destination: 'http://localhost:3002/auth' },
      { source: '/auth/:path*', destination: 'http://localhost:3002/auth/:path*' },
    ]
  },
}

module.exports = nextConfig
