/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Own zone for this app's real pages (callback, login-resume), matching
  // the same Multi-Zones pattern as "products" so its build assets don't
  // collide with home's when proxied through the gateway. The widget
  // bundle itself (public/login-widget.js) is loaded cross-origin by
  // home/products directly against :3002, so it is unaffected by this.
  basePath: '/auth',
}

module.exports = nextConfig
