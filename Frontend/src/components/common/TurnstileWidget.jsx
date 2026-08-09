import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

/*
  Reusable Cloudflare Turnstile widget for public, abuse-prone forms
  (signup, login, forgot password, magic link, ...).

  Usage:
    const turnstileRef = useRef(null);
    const [turnstileToken, setTurnstileToken] = useState("");

    <TurnstileWidget
      ref={turnstileRef}
      onToken={setTurnstileToken}
      onExpire={() => setTurnstileToken("")}
    />

  After a submit attempt (success or failure), call
  `turnstileRef.current?.reset()` so a fresh token is required next time —
  Turnstile tokens are single-use.
*/
const TurnstileWidget = forwardRef(function TurnstileWidget(
  { onToken, onExpire, className = "" },
  ref,
) {
  const widgetRef = useRef(null);
  const [errored, setErrored] = useState(false);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setErrored(false);
      onToken?.("");
      widgetRef.current?.reset();
    },
  }));

  if (!SITE_KEY) {
    // Misconfigured environment — fail loudly in dev, but don't crash the form.
    if (import.meta.env.DEV) {
      console.error(
        "VITE_TURNSTILE_SITE_KEY is not set — Turnstile widget cannot render.",
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <Turnstile
        ref={widgetRef}
        siteKey={SITE_KEY}
        onSuccess={(token) => {
          setErrored(false);
          onToken?.(token);
        }}
        onExpire={() => {
          onToken?.("");
          onExpire?.();
        }}
        onError={() => {
          setErrored(true);
          onToken?.("");
        }}
        options={{ theme: "light" }}
      />
      {errored && (
        <p className="text-xs text-red-500 mt-1">
          Verification failed to load. Please refresh and try again.
        </p>
      )}
    </div>
  );
});

export default TurnstileWidget;
