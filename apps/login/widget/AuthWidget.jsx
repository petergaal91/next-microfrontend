import { useEffect } from "react";
import { useStrivacity } from "@strivacity/sdk-next";
import { useNativeLogin } from "./useNativeLogin";

// The API doesn't hand back a dedicated "session id" — the closest thing
// is the challenge token embedded in hostedUrl, which identifies this
// particular in-progress native flow.
function extractSessionId(hostedUrl) {
  if (!hostedUrl) return null;
  try {
    return new URL(hostedUrl).searchParams.get("challenge");
  } catch {
    return null;
  }
}

export default function AuthWidget({ sessionId = null, language = null }) {
  const {
    loading: sdkLoading,
    isAuthenticated,
    idTokenClaims,
    accessToken,
    revoke,
  } = useStrivacity();

  const ctx = useNativeLogin({
    sessionId,
    language,
    onFallback: (error) => {
      if (error.url) window.location.href = error.url.toString();
    },
    onError: (error) => console.error("[login-widget] error", error),
    onGlobalMessage: (message) =>
      console.warn("[login-widget] message", message),
  });

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sty:auth-changed", {
        detail: {
          isAuthenticated,
          idTokenClaims,
          accessToken,
          revoke,
          loginScreen: ctx.state.screen ?? null,
          loginSessionId: extractSessionId(ctx.state.hostedUrl),
        },
      }),
    );
  }, [
    isAuthenticated,
    idTokenClaims,
    accessToken,
    revoke,
    ctx.state.screen,
    ctx.state.hostedUrl,
  ]);

  if (isAuthenticated) {
    return (
      <div style={styles.session}>
        <span style={styles.sessionText}>Signed in</span>
        <button type="button" style={styles.button} onClick={() => revoke()}>
          Sign out
        </button>
      </div>
    );
  }

  if (sdkLoading || ctx.loading) {
    return (
      <div style={{ padding: "6px 10px", fontSize: 13, color: "#666" }}>
        Loading...
      </div>
    );
  }

  if (!ctx.state.screen) {
    return (
      <button type="button" style={styles.button} onClick={() => ctx.login()}>
        Log in
      </button>
    );
  }

  switch (ctx.state.screen) {
    case "identification":
      return (
        <form
          style={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            ctx.submitForm("identifier", formData);
          }}
        >
          <input
            style={styles.input}
            type="text"
            name="identifier"
            placeholder="Identifier"
            required
          />
          <button type="submit" style={styles.button}>
            Continue
          </button>
        </form>
      );

    case "password":
      return (
        <form
          style={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(e.target));
            ctx.submitForm("password", formData);
          }}
        >
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit" style={styles.button}>
            Continue
          </button>
        </form>
      );

    default: {
      ctx.triggerFallback("Unknown screen");
      return null;
    }
  }
}

const styles = {
  session: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    fontFamily: "system-ui, sans-serif",
  },
  sessionText: { fontSize: 13 },
  button: {
    padding: "6px 10px",
    fontSize: 13,
    fontFamily: "system-ui, sans-serif",
    background: "#111",
    color: "#fff",
    border: "1px solid #111",
    borderRadius: 4,
    cursor: "pointer",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
  },
  form: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "system-ui, sans-serif",
  },
  input: {
    padding: "6px 10px",
    fontSize: 13,
    fontFamily: "inherit",
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box",
    outline: "none",
  },
};
