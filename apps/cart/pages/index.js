import Script from "next/script";

export default function CartDemo() {
  function addSampleItem() {
    window.dispatchEvent(
      new CustomEvent("sty:cart-add", {
        detail: { name: "Sample item", price: 9.99 },
      }),
    );
  }

  return (
    <main style={styles.main}>
      <h1>Cart micro-app</h1>
      <p style={styles.text}>
        This standalone Next.js app builds and serves{" "}
        <code>/cart-widget.js</code>, a bundle that registers the{" "}
        <code>&lt;cart-widget&gt;</code> custom element. It listens for{" "}
        <code>sty:cart-add</code> DOM events dispatched by any page (e.g. the
        products app) and persists state to <code>localStorage</code>.
      </p>
      <h2 style={styles.subtitle}>Isolated preview</h2>
      <button style={styles.button} onClick={addSampleItem}>
        Dispatch sty:cart-add
      </button>
      <div style={styles.widgetSlot}>
        <cart-widget></cart-widget>
      </div>
      <Script src="/cart-widget.js" strategy="afterInteractive" />
    </main>
  );
}

const styles = {
  main: { fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 640 },
  text: { lineHeight: 1.6, color: "#444" },
  subtitle: { fontSize: 16, marginTop: 32 },
  button: {
    padding: "8px 12px",
    fontSize: 13,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  widgetSlot: { marginTop: 16 },
};
