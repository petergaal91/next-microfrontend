import Script from 'next/script'
import '../styles/globals.css'

// The login and cart shared modules are their own standalone Next.js apps
// (ports 3002 / 3003). Loading their built widget bundle here means both
// modules are fetched and registered as custom elements as soon as this
// app loads, before any page-specific code needs them.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="http://localhost:3002/auth/login-widget.js" strategy="afterInteractive" />
      <Script src="http://localhost:3003/cart-widget.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  )
}
