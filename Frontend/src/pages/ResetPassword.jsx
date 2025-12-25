import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {resetPassword} from "../api/user.api"
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await resetPassword(token, password);

      toast.success(data.message || "Password reset successful");

      // 🔥 redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Reset link is invalid or expired"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">

        <p className="text-2xl font-semibold">
          Reset Password
        </p>

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

        <button
          disabled={loading}
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <Link
          to="/login"
          className="text-primary underline text-sm"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ResetPassword;
