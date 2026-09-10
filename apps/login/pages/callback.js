import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStrivacity } from '@strivacity/sdk-next'

// Reached at STRIVACITY_REDIRECT_URI, i.e. http://localhost:3000/callback
// through the home gateway's rewrite (see apps/home/next.config.js).
export default function Callback() {
  const router = useRouter()
  const { handleCallback } = useStrivacity()

  useEffect(() => {
    ;(async () => {
      const url = new URL(window.location.href)
      const sessionId = url.searchParams.get('session_id')

      if (sessionId) {
        // An externally-started flow (e.g. a magic link) needs the full
        // native-flow renderer to resume, which only /login hosts.
        router.push(`/login?session_id=${sessionId}`)
        return
      }

      try {
        await handleCallback()
        router.push('/')
      } catch (error) {
        console.error('Error during callback handling:', error)
      }
    })()
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Logging in...</h1>
    </main>
  )
}
