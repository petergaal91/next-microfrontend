import { useEffect, useState } from 'react'
import LoginWidgetSlot from './LoginWidgetSlot'

export default function Header() {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    function handleAuthChanged(event) {
      setAuth(event.detail)
    }
    window.addEventListener('sty:auth-changed', handleAuthChanged)
    return () => window.removeEventListener('sty:auth-changed', handleAuthChanged)
  }, [])

  const loginInProgress = Boolean(auth && !auth.isAuthenticated && auth.loginScreen)

  return (
    <header style={styles.header}>
      <span style={styles.logo}>MFE Store</span>
      <nav style={styles.nav}>
        {/* Plain anchors: these cross zone boundaries (home vs products),
            so next/link's basePath-aware routing does not apply here. */}
        <a href="/" style={styles.link}>Home</a>
        <a href="/products" style={styles.link}>Products</a>
        {loginInProgress && (
          <span style={styles.sessionBadge}>
            <span style={styles.sessionDot} />
            Login in progress
            {auth.loginSessionId && <code style={styles.sessionId}>{auth.loginSessionId.slice(0, 8)}</code>}
          </span>
        )}
      </nav>
      <div style={styles.widgets}>
        <LoginWidgetSlot />
        {/* Custom element registered by the cart micro-app */}
        <cart-widget></cart-widget>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flexWrap: 'wrap',
    padding: '12px 24px',
    borderBottom: '1px solid #e5e5e5',
    background: '#fff',
  },
  logo: { fontWeight: 700, fontSize: 18 },
  nav: { display: 'flex', alignItems: 'center', gap: 16, flex: 1 },
  link: { textDecoration: 'none', fontSize: 14, color: '#333' },
  widgets: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  sessionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    fontSize: 12,
    color: '#8a5a00',
    background: '#fff6e0',
    border: '1px solid #ffe1a3',
    borderRadius: 999,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#e0a300',
    flexShrink: 0,
  },
  sessionId: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 11,
    color: '#a97600',
  },
}
