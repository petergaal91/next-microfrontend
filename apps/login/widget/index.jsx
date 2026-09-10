import { createRoot } from "react-dom/client";
import AuthProvider from "./AuthProvider";
import AuthWidget from "./AuthWidget";

const roots = new WeakMap();

function mount(container, props = {}) {
  if (roots.has(container)) return;
  const root = createRoot(container);
  root.render(
    <AuthProvider>
      <AuthWidget {...props} />
    </AuthProvider>,
  );
  roots.set(container, root);
}

function unmount(container) {
  const root = roots.get(container);
  if (!root) return;
  root.unmount();
  roots.delete(container);
}

if (typeof window !== "undefined") {
  window.LoginWidget = { mount, unmount };
  // Consumers that render their container before this script has finished
  // loading (the common case with next/script's afterInteractive) listen
  // for this instead of polling for window.LoginWidget to show up.
  window.dispatchEvent(new CustomEvent("sty:login-widget-ready"));
}
