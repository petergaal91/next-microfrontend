import Header from '../components/Header'

export default function Home() {
  return (
    <main>
      <Header />
      <section style={styles.hero}>
        <h1>Welcome to the Home micro-app</h1>
        <p style={styles.text}>
          This page is served by the <code>home</code> Next.js app (port 3000),
          the default zone in this Multi-Zones setup. The <code>login-widget</code>{' '}
          and <code>cart-widget</code> elements in the header come from two
          independent Next.js apps (<code>login</code> on :3002, <code>cart</code> on
          :3003) that were loaded as plain scripts when this page loaded.
        </p>
        <a href="/products" style={styles.cta}>Browse products &rarr;</a>
      </section>
    </main>
  )
}

const styles = {
  hero: { padding: '48px 24px', maxWidth: 720 },
  text: { lineHeight: 1.6, color: '#444' },
  cta: { display: 'inline-block', marginTop: 16, fontWeight: 600 },
}
