import Script from "next/script";
import LoginWidgetSlot from "../components/LoginWidgetSlot";

export default function LoginDemo() {
  return (
    <main style={styles.main}>
      <h1>Login micro-app</h1>
      <p style={styles.text}>
        This standalone Next.js app builds and serves{" "}
        <code>/login-widget.js</code>, a bundle that exposes{" "}
        <code>window.LoginWidget.mount(container)</code>. It wraps{" "}
        <code>@strivacity/sdk-next</code> in <code>native</code> mode, rendering
        Strivacity's policy-driven login journey with this app's own components
        instead of a hosted page. The <code>home</code> and{" "}
        <code>products</code> apps load this script on page load and mount it
        into a plain container &mdash; see <code>LoginWidgetSlot</code>.
      </p>
      <p style={styles.text}>
        Once signed in, the widget announces the session via a{" "}
        <code>sty:auth-changed</code> DOM event so any other app on the page can
        react &mdash; see the account panel on the products page.
      </p>
      <h2 style={styles.subtitle}>Isolated preview</h2>
      <LoginWidgetSlot />
      <Script src="/auth/login-widget.js" strategy="afterInteractive" />
    </main>
  );
}

const styles = {
  main: { fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 640 },
  text: { lineHeight: 1.6, color: "#444" },
  subtitle: { fontSize: 16, marginTop: 32 },
};
