import { useEffect, useState } from "react";
import Header from "../components/Header";

const PRODUCTS = [
  { id: "p1", name: "Classic Tee", price: 19.99 },
  { id: "p2", name: "Denim Jacket", price: 89.0 },
  { id: "p3", name: "Running Shoes", price: 64.5 },
  { id: "p4", name: "Wool Beanie", price: 14.9 },
];

export default function Products() {
  // Cross-app auth: products never imports the SDK. It just listens for
  // the event the login-widget (a completely separate React tree, loaded
  // from a different origin) announces on window.
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    function handleAuthChanged(event) {
      setAuth(event.detail);
    }
    window.addEventListener("sty:auth-changed", handleAuthChanged);
    return () =>
      window.removeEventListener("sty:auth-changed", handleAuthChanged);
  }, []);

  function addToCart(product) {
    // Decoupled contract: products doesn't know how cart stores state,
    // it just announces intent. The cart-widget listens for this event.
    window.dispatchEvent(new CustomEvent("sty:cart-add", { detail: product }));
  }

  return (
    <main>
      <Header />
      <section style={styles.account}>
        {auth?.isAuthenticated ? (
          <span>
            Signed in as {auth.idTokenClaims?.email ?? auth.idTokenClaims?.sub}{" "}
            &mdash; order history and saved addresses would unlock here.
          </span>
        ) : (
          <span>
            Not signed in &mdash; sign in above to see your order history.
          </span>
        )}
      </section>
      <section style={styles.grid}>
        {PRODUCTS.map((product) => (
          <div key={product.id} style={styles.card}>
            <strong>{product.name}</strong>
            <span style={styles.price}>${product.price.toFixed(2)}</span>
            <button style={styles.button} onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

const styles = {
  account: {
    padding: "12px 24px",
    fontSize: 13,
    color: "#444",
    background: "#fff",
    borderBottom: "1px solid #e5e5e5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
    padding: 24,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 16,
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
  },
  price: { color: "#555" },
  button: {
    marginTop: 8,
    padding: "8px 12px",
    fontSize: 13,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
