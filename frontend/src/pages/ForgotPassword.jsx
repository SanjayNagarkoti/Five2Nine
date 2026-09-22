import { useState } from "react";
import {
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  Link,
} from "react-router-dom";
import {
  requestPasswordReset,
} from "../service/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const accent = "#1F8A70";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response =
        await requestPasswordReset(
          email.trim()
        );

      setMessage(
        typeof response === "string"
          ? response
          : "If an account exists for this email, a reset link has been sent."
      );

      setStatus("success");
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      const errorMessage =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Something went wrong. Please try again.";

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
          Check your inbox
        </h2>

        <p className="text-[#8288A8] text-sm leading-6 mt-3">
          We've sent a password reset link to{" "}
          <span className="font-medium text-[#1B2140]">
            {email}
          </span>
          .
        </p>

        <div className="flex gap-5 mt-8">
          <button
            onClick={() => {
              setStatus("form");
              setMessage("");
            }}
            className="text-sm text-[#1F8A70] underline"
          >
            Change email
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
          Something went wrong
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
        Reset your password
      </h2>

      <p className="text-sm text-[#8288A8] mt-2 leading-6">
        Enter your registered email and we'll send
        you a secure password reset link.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#8288A8] mb-2">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            placeholder="Enter your registered email"
            disabled={loading}
            className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F8A70] disabled:opacity-60"
          />
        </div>

        {message && (
          <p className="text-sm text-red-500">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{
            backgroundColor: accent,
          }}
        >
          {loading
            ? "Sending..."
            : "Send reset link"}

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
              Keep your
              <br />
              account yours.
            </h1>

            <p className="text-[#B8BCD4] mt-6 leading-7 max-w-sm">
              Securely recover your Five2Nine account
              whenever you need it.
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