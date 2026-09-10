import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const STORAGE_KEY = "sty:cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function CartWidget() {
  const [items, setItems] = useState(() => readCart());
  const [open, setOpen] = useState(false);

  const sync = useCallback((next) => {
    setItems(next);
    writeCart(next);
  }, []);

  useEffect(() => {
    // Host pages (e.g. the products page) announce cart intent via a
    // plain DOM event instead of calling into this widget's internals.
    function handleAdd(event) {
      sync([...readCart(), event.detail]);
    }
    // Keeps multiple mounted cart widgets (or tabs) in sync.
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) setItems(readCart());
    }
    window.addEventListener("sty:cart-add", handleAdd);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("sty:cart-add", handleAdd);
      window.removeEventListener("storage", handleStorage);
    };
  }, [sync]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={styles.wrapper}>
      <button style={styles.toggle} onClick={() => setOpen((o) => !o)}>
        Cart ({items.length})
      </button>
      {open && (
        <div style={styles.panel}>
          {items.length === 0 && <p style={styles.empty}>Cart is empty</p>}
          {items.map((item, index) => (
            <div key={index} style={styles.row}>
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          {items.length > 0 && (
            <div style={styles.totalRow}>
              <strong>Total</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: "relative", fontFamily: "system-ui, sans-serif" },
  toggle: {
    padding: "6px 10px",
    fontSize: 13,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  },
  panel: {
    position: "absolute",
    top: "110%",
    right: 0,
    width: 200,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    zIndex: 10,
  },
  empty: { fontSize: 12, color: "#777", margin: 0 },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    padding: "4px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginTop: 8,
    paddingTop: 8,
    borderTop: "1px solid #eee",
  },
};

class CartWidgetElement extends HTMLElement {
  connectedCallback() {
    if (this._root) return;
    this._root = createRoot(this);
    this._root.render(<CartWidget />);
  }

  disconnectedCallback() {
    this._root?.unmount();
    this._root = null;
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("cart-widget")
) {
  customElements.define("cart-widget", CartWidgetElement);
}
