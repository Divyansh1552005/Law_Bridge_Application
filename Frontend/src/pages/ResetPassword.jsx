import { useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/user.api";
import { toast } from "react-toastify";
import TurnstileWidget from "../components/common/TurnstileWidget.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const turnstileRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState("");

  // Password strength checks — same rules as signup
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasLength = password.length >= 8;
  const passwordValid =
    hasUpper && hasLower && hasSpecial && hasNumber && hasLength;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      toast.error("Password does not meet the requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!turnstileToken) {
      toast.error("Please complete the verification challenge first.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await resetPassword(token, password, turnstileToken);

      toast.success(data.message || "Password reset successful");

      // 🔥 redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset link is invalid or expired",
      );
    } finally {
      setLoading(false);
      turnstileRef.current?.reset();
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">Reset Password</p>

        <div className="w-full">
          <p>New Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Password strength rules */}
        {password.length > 0 && (
          <ul className="text-xs w-full">
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

        <div className="w-full">
          <p>Confirm Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <TurnstileWidget
          ref={turnstileRef}
          onToken={setTurnstileToken}
          className="w-full"
        />

        <button
          disabled={
            loading ||
            !passwordValid ||
            password !== confirmPassword ||
            !turnstileToken
          }
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link to="/login" className="text-primary underline text-sm">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ResetPassword;
