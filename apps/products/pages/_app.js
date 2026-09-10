import Script from 'next/script'
import '../styles/globals.css'

// Same shared modules as the home app: loaded once on page load,
// independent of which zone the page belongs to.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="http://localhost:3002/auth/login-widget.js" strategy="afterInteractive" />
      <Script src="http://localhost:3003/cart-widget.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  )
}
