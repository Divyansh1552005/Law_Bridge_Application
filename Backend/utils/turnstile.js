import axios from "axios";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/*
  Verifies a Cloudflare Turnstile token against the Siteverify API.

  Never logs the token or the secret — only the resulting error codes,
  which are safe, non-secret diagnostic strings (e.g. "invalid-input-response").
*/
export const verifyTurnstileToken = async (token, remoteip) => {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const params = new URLSearchParams();
  params.append("secret", process.env.TURNSTILE_SECRET_KEY);
  params.append("response", token);
  if (remoteip) {
    params.append("remoteip", remoteip);
  }

  const { data } = await axios.post(SITEVERIFY_URL, params, {
    timeout: 5000,
  });

  return {
    success: Boolean(data?.success),
    errorCodes: data?.["error-codes"] || [],
  };
};
