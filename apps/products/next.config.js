/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Owns the /products URL space when composed behind the "home" zone.
  basePath: '/products',
}

module.exports = nextConfig
