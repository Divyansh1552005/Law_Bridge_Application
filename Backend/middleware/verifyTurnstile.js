import { verifyTurnstileToken } from "../utils/turnstile.js";

/*
  verifyTurnstile — gate for public, abuse-prone endpoints (signup, login,
  forgot-password, magic-link, etc).

  Expects the frontend to send `turnstileToken` alongside the normal request
  body. The token is verified against Cloudflare's Siteverify API before the
  request is allowed to reach the controller. The token is never persisted
  or logged, and is stripped from req.body once handled so it can't leak
  into downstream validation/DB writes.

  Fails closed: if Cloudflare can't be reached, the request is rejected
  rather than silently letting a potentially-automated request through.
*/
export const verifyTurnstile = async (req, res, next) => {
  const { turnstileToken } = req.body || {};

  if (!turnstileToken || typeof turnstileToken !== "string") {
    return res.status(403).json({
      success: false,
      message: "Human verification required.",
    });
  }

  // req.ip is safe to trust here — app.set("trust proxy", 1) in server.js
  // means it already reflects the first hop's X-Forwarded-For value.
  const remoteip = req.ip;

  try {
    const { success, errorCodes } = await verifyTurnstileToken(
      turnstileToken,
      remoteip,
    );

    delete req.body.turnstileToken;

    if (!success) {
      const message = errorCodes.includes("timeout-or-duplicate")
        ? "Verification expired or was already used. Please try again."
        : "Human verification failed. Please try again.";

      return res.status(403).json({
        success: false,
        message,
      });
    }

    return next();
  } catch (error) {
    delete req.body.turnstileToken;

    // Cloudflare unreachable / network failure — fail closed.
    return res.status(503).json({
      success: false,
      message: "Verification service unavailable. Please try again shortly.",
    });
  }
};

export default verifyTurnstile;
