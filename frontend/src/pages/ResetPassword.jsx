import { useState } from "react";
import {
  ArrowRight,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  resetPassword,
} from "../service/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const accent = "#1F8A70";

  const handleChange = (field) => (e) => {
    setForm((previous) => ({
      ...previous,
      [field]: e.target.value,
    }));

    if (status === "error") {
      setStatus("form");
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (form.newPassword.length < 8) {
      setStatus("error");
      setMessage(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        newPassword: form.newPassword,
      });

      setStatus("success");
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "The reset link is invalid or has expired.";

      setMessage(errorMessage);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <AuthShell>
        <div className="w-14 h-14 rounded-full bg-[#E4F3EE] flex items-center justify-center">
          <Check
            size={28}
            className="text-[#1F8A70]"
          />
        </div>

        <h2
          className="text-3xl text-[#1B2140] mt-7"
          style={{
            fontFamily: "'Fraunces', serif",
          }}
        >
          Password changed
        </h2>

        <p className="text-[#8288A8] text-sm leading-6 mt-3">
          Your password has been successfully reset.
          You can now sign in with your new password.
        </p>

        <Link
          to="/login"
          className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-[#1F8A70] underline"
        >
          Back to login
          <ArrowRight size={15} />
        </Link>
      </AuthShell>
    );
  }

  if (status === "error") {
    return (
      <AuthShell>
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertCircle
            size={28}
            className="text-red-500"
          />
        </div>

        <h2
          className="text-3xl text-[#1B2140] mt-7"
          style={{
            fontFamily: "'Fraunces', serif",
          }}
        >
          Reset link unavailable
        </h2>

        <p className="text-[#8288A8] text-sm leading-6 mt-3">
          {message}
        </p>

        <div className="flex gap-5 mt-8">
          <button
            onClick={() => {
              setStatus("form");
              setMessage("");
            }}
            className="text-sm text-[#1F8A70] underline"
          >
            Try again
          </button>

          <Link
            to="/login"
            className="text-sm text-[#1F8A70] underline"
          >
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h2
        className="text-3xl text-[#1B2140]"
        style={{
          fontFamily: "'Fraunces', serif",
        }}
      >
        Create a new password
      </h2>

      <p className="text-sm text-[#8288A8] mt-2">
        Choose a new password for your account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-8"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#8288A8] mb-2">
            New password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              required
              value={form.newPassword}
              onChange={handleChange(
                "newPassword"
              )}
              placeholder="At least 8 characters"
              disabled={loading}
              className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-[#1F8A70] disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8288A8]"
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#8288A8] mb-2">
            Confirm password
          </label>

          <div className="relative">
            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              required
              value={form.confirmPassword}
              onChange={handleChange(
                "confirmPassword"
              )}
              placeholder="Confirm your new password"
              disabled={loading}
              className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-[#1F8A70] disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8288A8]"
            >
              {showConfirmPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#8288A8]">
          Password must contain at least 8 characters.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            backgroundColor: accent,
          }}
        >
          {loading
            ? "Updating password..."
            : "Reset password"}

          {!loading && (
            <ArrowRight size={16} />
          )}
        </button>
      </form>

      <p className="text-sm text-[#8288A8] mt-6">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-[#1F8A70] font-medium underline"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-[#E9E5DA] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[1100px] min-h-[620px] grid lg:grid-cols-[0.8fr_1fr] bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(27,33,64,0.12)]">

        <div className="hidden lg:flex bg-[#1B2140] text-white p-12 flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1F8A70] flex items-center justify-center font-bold text-sm">
              F2N
            </div>

            <span
              className="text-xl"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              Five2Nine
            </span>
          </div>

          <div>
            <p className="uppercase text-xs tracking-[0.2em] text-[#1F8A70] mb-4">
              Account security
            </p>

            <h1
              className="text-5xl leading-tight"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              A fresh start,
              <br />
              securely.
            </h1>

            <p className="text-[#B8BCD4] mt-6 leading-7 max-w-sm">
              Update your password and get back to
              Five2Nine.
            </p>
          </div>

          <p className="text-[#7C81A6] text-sm">
            Five2Nine
          </p>
        </div>

        <div className="flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-[420px]">

            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-[#1F8A70] flex items-center justify-center font-bold text-xs text-white">
                F2N
              </div>

              <span
                className="text-lg text-[#1B2140]"
                style={{
                  fontFamily: "'Fraunces', serif",
                }}
              >
                Five2Nine
              </span>
            </div>

            {children}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}