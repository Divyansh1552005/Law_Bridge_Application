import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import { verifyUserEmail, resendVerification} from "../api/user.api"

const Verify = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("loading");
  // loading | success | error
  const [message, setMessage] = useState("");

  // resend email state
  const [resendStatus, setResendStatus] = useState("idle");
  // idle | sending | sent

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await verifyUserEmail(token)

        setStatus("success");
        setMessage(data.message || "Email verified successfully");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
          "Verification link is invalid or expired"
        );
      }
    };

    if (token) verifyEmail();
  }, [token]);

  // RESEND VERIFICATION
  const handleResend = async () => {
    try {
      setResendStatus("sending");

      const { data } = await resendVerification(token)

      toast.success(
        data.message || "Verification email sent"
      );
      setResendStatus("sent");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Could not resend email"
      );
      setResendStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

        {status === "loading" && (
          <>
            <div className="animate-spin mx-auto mb-4 h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying your email
            </h2>
            <p className="mt-2 text-gray-500">
              Please wait a moment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-green-600">
              Email Verified
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>

            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>

            <button
              onClick={handleResend}
              disabled={resendStatus !== "idle"}
              className="mt-4 text-sm text-primary underline disabled:opacity-60"
            >
              {resendStatus === "sending"
                ? "Sending email..."
                : resendStatus === "sent"
                ? "Email already sent ✓"
                : "Resend verification email"}
            </button>

            <Link
              to="/login"
              className="mt-6 block rounded-lg bg-gray-800 px-6 py-2 text-white font-medium hover:bg-gray-900 transition"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
