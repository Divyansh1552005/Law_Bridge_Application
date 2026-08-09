import React, { useContext, useRef, useState, useEffect } from "react";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../api/axiosClient";
import {
  setAdminAccessToken,
  setLawyerAccessToken,
} from "../context/auth.tokens";
import TurnstileWidget from "../components/common/TurnstileWidget";

const Login = () => {
  const [state, setState] = useState("Admin");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownSecs, setCooldownSecs] = useState(0);

  const turnstileRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  const navigate = useNavigate();

  const { adminData, setAdminData, lawyerData, setLawyerData, authLoading } =
    useContext(AppContext);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading) {
      if (adminData) {
        navigate("/admin-dashboard");
      } else if (lawyerData) {
        navigate("/lawyer-dashboard");
      }
    }
  }, [adminData, lawyerData, authLoading, navigate]);

  const startCooldown = (seconds = 60, backendMessage = "") => {
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

    if (state === "Admin") {
      try {
        const { data } = await api.post("/api/admin/login", {
          email,
          password,
          turnstileToken,
        });

        if (data.success) {
          // Store access token in memory
          setAdminAccessToken(data.accessToken);

          // Store admin data in context
          setAdminData(data.admin);

          toast.success("Login successful!");
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message || "Invalid credentials, please try again.");
        }
      } catch (error) {
        if (error.response?.status === 429) {
          startCooldown(60, error.response?.data?.message);
          // toast already shown by axios interceptor
        } else if (!error.handled) {
          if (error.response) {
            const msg =
              error.response.data?.message ||
              "Invalid credentials, please try again.";
            toast.error(msg);
          } else if (error.request) {
            toast.error(
              "No response from server. Please check your internet or backend connection.",
            );
          } else {
            toast.error(`Login failed: ${error.message}`);
          }
        }
      } finally {
        setLoading(false);
        turnstileRef.current?.reset();
      }
    } else {
      // Lawyer Login Logic
      try {
        const { data } = await api.post("/api/lawyer/login", {
          email,
          password,
          turnstileToken,
        });

        if (data.success) {
          // Store access token in memory
          setLawyerAccessToken(data.accessToken);

          // Store lawyer data in context
          setLawyerData(data.lawyer);

          toast.success("Lawyer login successful!");
          navigate("/lawyer-dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } catch (error) {
        if (error.response?.status === 429) {
          startCooldown(60, error.response?.data?.message);
          // toast already shown by axios interceptor
        } else if (!error.handled) {
          if (error.response) {
            const msg =
              error.response.data?.message ||
              "Invalid credentials, please try again.";
            toast.error(msg);
          } else if (error.request) {
            toast.error(
              "No response from server. Please check your internet or backend connection.",
            );
          } else {
            toast.error(`Login failed: ${error.message}`);
          }
        }
      } finally {
        setLoading(false);
        turnstileRef.current?.reset();
      }
    }
  };

  if (authLoading) {
    return <Loader minHeight="min-h-screen" />;
  }

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
        <TurnstileWidget
          ref={turnstileRef}
          onToken={setTurnstileToken}
          className="w-full"
        />
        <button
          disabled={loading || rateLimited || !turnstileToken}
          className="bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-60"
        >
          {rateLimited
            ? `Too many requests — wait ${cooldownSecs >= 60 ? `${Math.ceil(cooldownSecs / 60)}m` : `${cooldownSecs}s`}`
            : loading
              ? "Please wait..."
              : "Login"}
        </button>
        {state === "Admin" ? (
          <p>
            Lawyer Login?{" "}
            <span
              onClick={() => setState("Lawyer")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
