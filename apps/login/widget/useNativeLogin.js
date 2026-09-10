import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStrivacity, FallbackError } from "@strivacity/sdk-next";
import { unflattenObject } from "@strivacity/sdk-core/utils/object";

// Nothing starts automatically: call the returned `login()` (e.g. from a
// "Log in" button's onClick) to kick off the native session. It no-ops if
// the outer session is still loading or the user is already
// authenticated — callers don't need to gate this themselves.
//
// options:
//   params      - NativeParams forwarded to sdk.login()
//   sessionId   - resumes an existing session (e.g. from an entry link)
//   language    - initial language tag
//   onLogin, onClose, onError, onFallback, onGlobalMessage
export function useNativeLogin(options = {}) {
  const { sdk, loading: sessionLoading, isAuthenticated } = useStrivacity();
  const optionsRef = useRef(options);
  const stateRef = useRef({});
  const handlerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState({});
  const [messages, setMessages] = useState({});
  const [state, setState] = useState({});

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const handleResponse = useCallback(
    async (nextState) => {
      if (await sdk.isAuthenticated) {
        optionsRef.current.onLogin?.(sdk.idTokenClaims);
        return;
      }

      const newState = {
        hostedUrl: nextState?.hostedUrl ?? stateRef.current.hostedUrl,
        finalizeUrl: nextState?.finalizeUrl ?? stateRef.current.finalizeUrl,
        screen: nextState?.screen ?? stateRef.current.screen,
        forms: nextState?.forms ?? stateRef.current.forms,
        layout: nextState?.layout ?? stateRef.current.layout,
        messages: nextState?.messages ?? {},
        branding: nextState?.branding ?? stateRef.current.branding,
      };

      if (newState.screen !== stateRef.current.screen) {
        const nextForms = {};
        const nextMessages = {};
        for (const form of newState.forms ?? []) {
          nextForms[form.id] = {};
          nextMessages[form.id] = {};
        }
        setForms(nextForms);
        setMessages(nextMessages);
      } else {
        sdk.logging?.info(`Updating screen: ${newState.screen}`);
      }

      setMessages((previous) => {
        const next = { ...previous };
        Object.keys(newState.messages ?? {}).forEach((formId) => {
          if (formId === "global") {
            optionsRef.current.onGlobalMessage?.(
              newState.messages.global?.text ?? "",
            );
          } else {
            next[formId] = newState.messages[formId] ?? {};
          }
        });
        return next;
      });
      setState(newState);
      setLoading(false);
    },
    [sdk],
  );

  const startSession = useCallback(async () => {
    try {
      setLoading(true);
      handlerRef.current = sdk.login(optionsRef.current.params);
      const nextState = await handlerRef.current.startSession(
        optionsRef.current.sessionId,
        optionsRef.current.language,
      );
      if (nextState) await handleResponse(nextState);
    } catch (error) {
      if (error instanceof FallbackError) {
        sdk.logging?.error("Fallback error occurred", error);
        optionsRef.current.onFallback?.(error);
      } else {
        sdk.logging?.error("Error starting session", error);
        optionsRef.current.onError?.(error);
        setLoading(false);
      }
    }
  }, [sdk, handleResponse]);

  const login = useCallback(() => {
    if (!sdk || sessionLoading || isAuthenticated) return;
    startSession();
  }, [sdk, sessionLoading, isAuthenticated, startSession]);

  const triggerFallback = useCallback(
    (message) => {
      sdk.logging?.warn(
        message
          ? `Triggering fallback due to: ${message}`
          : "Triggering fallback",
      );

      // Reads `state` directly (not stateRef): this can be called
      // synchronously during the same render that just set state (e.g.
      // from the layout walker, while rendering), before the ref-sync
      // effect below has had a chance to catch up.
      if (!state.hostedUrl) {
        const error = new Error("No hosted URL provided");
        sdk.logging?.error("Fallback error", error);
        throw error;
      }

      optionsRef.current.onFallback?.(
        new FallbackError(new URL(state.hostedUrl)),
      );
    },
    [sdk, state],
  );

  const triggerClose = useCallback(() => {
    sdk.logging?.debug?.("Triggering close");
    optionsRef.current.onClose?.();
  }, [sdk]);

  const submitForm = useCallback(
    async (formId, customBody) => {
      try {
        setLoading(true);
        const body = customBody ?? unflattenObject(forms[formId] ?? {});
        const nextState = await handlerRef.current?.submitForm(formId, body);
        if (nextState) await handleResponse(nextState);
      } catch (error) {
        if (error instanceof FallbackError) {
          sdk.logging?.error("Fallback error occurred", error);
          optionsRef.current.onFallback?.(error);
        } else {
          sdk.logging?.error("Error submitting form", error);
          optionsRef.current.onError?.(error);
          setLoading(false);
        }
      }
    },
    [forms, handleResponse, sdk],
  );

  const setFormValue = useCallback((formId, widgetId, value) => {
    setForms((previous) => ({
      ...previous,
      [formId]: {
        ...(previous[formId] ?? {}),
        [widgetId]: value === "" ? null : value,
      },
    }));
  }, []);

  const setMessage = useCallback((formId, widgetId, value) => {
    setMessages((previous) => ({
      ...previous,
      [formId]: { ...(previous[formId] ?? {}), [widgetId]: value },
    }));
  }, []);

  return useMemo(
    () => ({
      loading,
      forms,
      messages,
      state,
      login,
      triggerFallback,
      triggerClose,
      submitForm,
      setFormValue,
      setMessage,
    }),
    [
      loading,
      forms,
      messages,
      state,
      login,
      triggerFallback,
      triggerClose,
      submitForm,
      setFormValue,
      setMessage,
    ],
  );
}
