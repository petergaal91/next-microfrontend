import { useEffect, useState } from 'react'
import AuthWidget from '../widget/AuthWidget'

// Full-page fallback for resuming a flow started outside the widget
// (e.g. a password-reset link), reached via /callback when a session_id
// is present. Reuses the same AuthWidget component the widget bundle
// renders, compiled here by Next's own webpack instead of esbuild.
export default function Login() {
  const [sessionId, setSessionId] = useState(null)
  const [language, setLanguage] = useState(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    setSessionId(url.searchParams.get('session_id'))
    setLanguage(url.searchParams.get('language'))
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 420 }}>
      <h1>Sign in</h1>
      <AuthWidget sessionId={sessionId} language={language} />
    </main>
  )
}
