import React, { useRef, useState, useEffect } from "react";
import useApp from "../context/useApp.jsx";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  resendVerification,
  signupUser,
  loginUser,
  forgotPassword,
  loginWithGoogle,
  requestMagicLink
} from "../api/user.api.js";
import { setAccessToken } from "../context/auth.tokens.js";
import TurnstileWidget from "../components/common/TurnstileWidget.jsx";

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Show error toast if redirected back from Google OAuth with an error
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "local_account_exists") {
      toast.error(
        "An account with this email already exists. Please log in with your email and password.",
      );
      // Clean up the query param from the URL without triggering a navigation
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);

  const [showResend, setShowResend] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownSecs, setCooldownSecs] = useState(0);

  const turnstileRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const navigate = useNavigate();
  const { setUserData } = useApp();

  // ===================== PASSWORD VALIDATION ==========================
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLength = password.length >= 8;

  const passwordValid =
    hasUpper && hasLower && hasSpecial && hasNumber && hasLength;

  // ===================== SUBMIT HANDLER =====================
  // ── cooldown timer on 429 ─────────────────────────────────────────────────
  // accepts seconds directly; parses "Try again in X minutes" from backend msg
  const startCooldown = (seconds = 10, backendMessage = "") => {
    // if backend says "Try again in X minutes", use that duration
    const minuteMatch = backendMessage.match(/try again in (\d+) minute/i);
    if (minuteMatch) {
      seconds = parseInt(minuteMatch[1], 10) * 60;
    }

    setRateLimited(true);
    let remaining = seconds;
    setCooldownSecs(remaining);

    const interval = setInterval(() => {
      remaining -= 1;
      setCooldownSecs(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setRateLimited(false);
        setCooldownSecs(0);
      }
    }, 1000);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (rateLimited) return;

    if (!turnstileToken) {
      toast.error("Please complete the verification challenge first.");
      return;
    }

    setLoading(true);
    setShowResend(false);
    setShowForgot(false);

    // ---------- SIGN UP ----------
    if (state === "Sign Up") {
      if (!passwordValid) {
        toast.error("Password does not meet requirements");
        setLoading(false);
        return;
      }

      try {
        const { data } = await signupUser(name, email, password, turnstileToken);

        if (data.success) {
          toast.success("Signup successful! Please verify your email.");
          navigate("/verify-email");
        }
      } catch (error) {
        const status = error.response?.status;
        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Registration failed";

        if (status === 429) {
          startCooldown(10, error.response?.data?.message);
          // toast already shown by axios interceptor
        } else if (status === 409) {
          toast.error("Account already exists. Please login.");
          setState("Login");
        } else {
          toast.error(msg);
        }
      } finally {
        setLoading(false);
        turnstileRef.current?.reset();
      }

      return;
    }

    // ---------- LOGIN ----------
    try {
      // first login attempt (email + password)
      const payload = requires2FA
        ? {
            ...pendingLogin,
            twoFactorCode,
          }
        : { email, password };

      const { data } = await loginUser(payload, turnstileToken);

      // 2FA required
      if (data.requires2FA) {
        setRequires2FA(true);
        setPendingLogin({ email, password });
        setLoading(false);
        turnstileRef.current?.reset();
        return;
      }

      // login success
      if (data.success) {
        setAccessToken(data.accessToken);
        setUserData(data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;

      if (status === 429) {
        startCooldown(10, msg);
        // toast already shown by axios interceptor
      } else if (status === 403 && msg?.toLowerCase().includes("verify")) {
        toast.error(msg);
        setShowResend(true);
      } else if (!error.handled) {
        toast.error(
          msg || "Login failed - " + (error.message || "Unknown error"),
        );
      }
    } finally {
      setLoading(false);
      turnstileRef.current?.reset();
    }
  };

  // =====================
  // RESEND VERIFICATION
  // =====================
  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const { data } = await resendVerification(email);

      if (data.success) {
        toast.success("Verification email sent again!");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        startCooldown(10, error.response?.data?.message);
        // toast already shown by axios interceptor
      } else if (!error.handled) {
        toast.error(
          error.response?.data?.message ||
            "Could not resend verification email",
        );
      }
    }
  };

  // =====================
  // FORGOT PASSWORD
  // =====================
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    if (rateLimited) return;

    if (!turnstileToken) {
      toast.error("Please complete the verification challenge first.");
      return;
    }

    setForgotLoading(true);

    try {
      const { data } = await forgotPassword(email, turnstileToken);

      toast.success(data.message || "Password reset email sent!");
      setShowForgot(false);
    } catch (error) {
      if (error.response?.status === 429) {
        startCooldown(10, error.response?.data?.message);
        // toast already shown by axios interceptor
      } else if (!error.handled) {
        toast.error(
          error.response?.data?.message || "Could not send reset email",
        );
      }
    } finally {
      setForgotLoading(false);
      turnstileRef.current?.reset();
    }
  };


  // magic link
  const handleMagicLink = async () => {
    if (!magicLinkEmail) {
      toast.error("Please enter your email");
      return;
    }

    if (!turnstileToken) {
      toast.error("Please complete the verification challenge first.");
      return;
    }

    setMagicLinkLoading(true);
    try {
      const { data } = await requestMagicLink(magicLinkEmail, turnstileToken);
      if (data.success) {
        setMagicLinkSent(true);
        toast.success("Magic link sent! Check your email.");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        startCooldown(10, error.response?.data?.message);
      } else if (!error.handled) {
        toast.error(error.response?.data?.message || "Could not send magic link");
      }
    } finally {
      setMagicLinkLoading(false);
      turnstileRef.current?.reset();
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up"
            ? "Create Account"
            : requires2FA
              ? "Two-Factor Authentication"
              : "Login"}
        </p>

        <p>
          {requires2FA
            ? "Enter the 6-digit code from your authenticator app"
            : `Please ${state === "Sign Up" ? "sign up" : "log in"} to book appointment`}
        </p>

        {/* SIGN UP NAME */}
        {state === "Sign Up" && !requires2FA && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        {!requires2FA && (
          <div className="w-full">
            <p>Email</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="email"
              required
            />
          </div>
        )}

        {/* PASSWORD */}
        {!requires2FA && (
          <div className="w-full">
            <p>Password</p>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD RULES */}
        {state === "Sign Up" && !requires2FA && (
          <ul className="mt-2 text-xs">
            <li className={hasLength ? "text-green-600" : "text-red-500"}>
              {hasLength ? "✔" : "✖"} At least 8 characters
            </li>
            <li className={hasUpper ? "text-green-600" : "text-red-500"}>
              {hasUpper ? "✔" : "✖"} One uppercase letter
            </li>
            <li className={hasLower ? "text-green-600" : "text-red-500"}>
              {hasLower ? "✔" : "✖"} One lowercase letter
            </li>
            <li className={hasNumber ? "text-green-600" : "text-red-500"}>
              {hasNumber ? "✔" : "✖"} One number
            </li>
            <li className={hasSpecial ? "text-green-600" : "text-red-500"}>
              {hasSpecial ? "✔" : "✖"} One special character (!@#$%^&*...)
            </li>
          </ul>
        )}

        {/* 2FA OTP INPUT */}
        {requires2FA && (
          <div className="w-full">
            <p>2FA Code</p>
            <input
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              placeholder="Enter 6-digit code"
              required
            />
          </div>
        )}

        {/* TURNSTILE VERIFICATION */}
        <TurnstileWidget
          ref={turnstileRef}
          onToken={setTurnstileToken}
          className="w-full"
        />

        <button
          disabled={
            loading ||
            rateLimited ||
            !turnstileToken ||
            (state === "Sign Up" && !passwordValid) ||
            (requires2FA && !twoFactorCode)
          }
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-60"
        >
          {rateLimited
            ? `Too many requests — wait ${cooldownSecs >= 60 ? `${Math.ceil(cooldownSecs / 60)}m` : `${cooldownSecs}s`}`
            : loading
              ? "Please wait..."
              : requires2FA
                ? "Verify & Login"
                : state === "Sign Up"
                  ? "Create account"
                  : "Login"}
        </button>

        {/* GOOGLE SIGN IN */}
        {!requires2FA && (
          <div className="w-full">
            <div className="flex items-center gap-2 my-1">
              <hr className="flex-1 border-[#DADADA]" />
              <span className="text-xs text-gray-400">or</span>
              <hr className="flex-1 border-[#DADADA]" />
            </div>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 border border-[#DADADA] rounded-md py-2 px-4 text-sm text-[#5E5E5E] hover:bg-gray-50 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.08-6.08C34.5 3.1 29.56 1 24 1 14.82 1 7.02 6.48 3.44 14.26l7.08 5.5C12.3 13.62 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.56-.14-3.08-.4-4.5H24v9h12.67c-.55 2.96-2.2 5.48-4.67 7.17l7.17 5.57C43.5 38.1 46.5 31.8 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.52 28.76A14.6 14.6 0 0 1 9.5 24c0-1.66.29-3.26.8-4.76l-7.08-5.5A23.9 23.9 0 0 0 1 24c0 3.86.92 7.5 2.56 10.72l6.96-5.96z"
                />
                <path
                  fill="#34A853"
                  d="M24 47c5.56 0 10.22-1.84 13.63-5l-7.17-5.57C28.78 37.7 26.52 38.5 24 38.5c-6.3 0-11.65-4.12-13.48-9.74l-6.96 5.96C7.06 42.56 14.84 47 24 47z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {state === "Login" && !requires2FA && (
          <p
            onClick={() => setShowForgot(!showForgot)}
            className="text-sm text-primary underline cursor-pointer"
          >
            Forgot password?
          </p>
        )}

        {state === "Login" && showForgot && !requires2FA && (
          <div className="w-full text-sm">
            <p className="text-red-500">
              We'll send a password reset link to your email.
            </p>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={forgotLoading || rateLimited || !turnstileToken}
              className="mt-2 bg-primary text-white px-4 py-1 rounded-md disabled:opacity-60"
            >
              {rateLimited
                ? `Wait ${cooldownSecs}s`
                : forgotLoading
                  ? "Sending..."
                  : "Send reset email"}
            </button>
          </div>
        )}
        
        {/* MAGIC LINK */}
        {state === "Login" && !requires2FA && (
          <div className="w-full">
            <p
              onClick={() => {
                setShowMagicLink(!showMagicLink);
                setMagicLinkSent(false);
                setMagicLinkEmail(email); // prefill with whatever email user typed
              }}
              className="text-sm text-primary underline cursor-pointer"
            >
              Login with magic link instead
            </p>
        
            {showMagicLink && (
              <div className="mt-3 w-full">
                {magicLinkSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
                    Magic link sent to <strong>{magicLinkEmail}</strong>. 
                    Check your email — link expires in 15 minutes.
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-2">
                      We'll send a one-time login link to your email.
                    </p>
                    <input
                      type="email"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="border border-[#DADADA] rounded w-full p-2 text-sm mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleMagicLink}
                      disabled={magicLinkLoading || rateLimited || !turnstileToken}
                      className="bg-primary text-white w-full py-2 rounded-md text-sm disabled:opacity-60"
                    >
                      {rateLimited
                        ? `Wait ${cooldownSecs}s`
                        : magicLinkLoading
                        ? "Sending..."
                        : "Send magic link"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* RESEND VERIFICATION */}
        {state === "Login" && showResend && !requires2FA && (
          <p className="text-sm text-red-500">
            Email not verified.&nbsp;
            <span
              onClick={handleResendVerification}
              className="text-primary underline cursor-pointer"
            >
              Resend verification email
            </span>
          </p>
        )}
        
        

        {/* SWITCH MODE */}
        {!requires2FA && (
          <>
            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setState("Login")}
                  className="text-primary underline cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Create a new account?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-primary underline cursor-pointer"
                >
                  Click here
                </span>
              </p>
            )}
          </>
        )}
      </div>
    </form>
  );
};

export default Login;
