import { useState } from "react";
import { ArrowRight, Check, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "../service/authService";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
  });

  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState("false");
  const [submitted, setSubmitted] = useState(false);
  const accent = "#1F8A70";

  const handleChange = (e) => {
    setForm({
      email: e.target.value,
    });

    // If user starts typing again after an error
    if (status === "error") {
      setStatus("form");
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await requestPasswordReset(form.email.trim());

      console.log("Password reset response:", response);

      setMessage(
        typeof response === "string"
          ? response
          : "If an account exists for this email, a password reset link has been sent. Check your mail.",
      );

      setStatus("success");
    } catch (error) {
      console.error("Password reset error:", error);

      let errorMessage = "Something went wrong. Please try again later.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setMessage(errorMessage);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // SUCCESS SCREEN
  // ------------------------------------------------

  if (status === "success") {
    return (
      <div
        className="min-h-screen w-full flex justify-center bg-[#E9E5DA]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>

        <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] lg:shadow-[0_0_80px_rgba(27,33,64,0.12)]">
          <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-[420px]">
              {/* SUCCESS ICON */}

              <div className="w-14 h-14 rounded-full bg-[#E4F3EE] flex items-center justify-center mb-7">
                <Check size={28} strokeWidth={2.5} className="text-[#1F8A70]" />
              </div>
              {/* Change mail */}
              <p
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  window.location.href="/forgot-password"
                  setUserError("");
                }}
                className="text-[#8288A8] text-sm mb-7"
              >
                Didn't recieve reset link ?{" "}
                <button className="inline-flex items-center text-[#1F8A70] font-medium text-[14.5px] underline underline-offset-4 decoration-[#A8D8CC] ">
                  Change your mail
                </button>
              </p>
              {/* TITLE */}
              <h2
                className="text-[1.75rem] text-[#1B2140] mb-2"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                }}
              >
                Password reset email sent.
              </h2>

              {/* MESSAGE */}
              <p className="text-[#8288A8] text-[15px] leading-6 mb-8">
                We've sent a password reset link to{" "}
                <span className="text-[#1B2140] font-medium">{form.email}</span>
                . Check your inbox and follow the link to reset your password.
              </p>

              {/* BACK TO LOGIN */}
              <Link
                to="/login"
                className="inline-flex items-center text-[#1F8A70] font-medium text-[14.5px] underline underline-offset-4 decoration-[#A8D8CC]"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // ERROR SCREEN
  // ------------------------------------------------

  if (status === "error") {
    return (
      <div
        className="min-h-screen w-full flex justify-center bg-[#E9E5DA]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>

        <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] lg:shadow-[0_0_80px_rgba(27,33,64,0.12)]">
          <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-[420px]">
              {/* ERROR ICON */}
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-7">
                <AlertCircle
                  size={28}
                  strokeWidth={2}
                  className="text-red-500"
                />
              </div>

              {/* TITLE */}
              <h2
                className="text-[1.75rem] text-[#1B2140] mb-2"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 500,
                }}
              >
                Something went wrong.
              </h2>

              {/* ERROR MESSAGE */}
              <p className="text-[#8288A8] text-[15px] leading-6 mb-8">
                {message}
              </p>

              {/* TRY AGAIN */}
              <button
                onClick={() => {
                  setStatus("form");
                  setMessage("");
                }}
                className="text-[#1F8A70] font-medium text-[14.5px] underline underline-offset-4 decoration-[#A8D8CC] mr-6"
              >
                Try again
              </button>

              {/* LOGIN */}
              <Link
                to="/login"
                className="text-[#1F8A70] font-medium text-[14.5px] underline underline-offset-4 decoration-[#A8D8CC]"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // FORM SCREEN
  // ------------------------------------------------

  return (
    <div
      className="min-h-screen w-full flex justify-center bg-[#E9E5DA]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] lg:shadow-[0_0_80px_rgba(27,33,64,0.12)]">
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[420px]">
            {/* TITLE */}
            <h2
              className="text-[1.75rem] text-[#1B2140] mb-1.5"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 500,
              }}
            >
              Password Reset
            </h2>

            {/* BACK TO LOGIN */}
            <p className="text-[#8288A8] text-sm mb-7">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
              >
                Back to Login
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL */}
              <div>
                <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  disabled={loading}
                  className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-[#1F8A70] disabled:opacity-60"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-lg py-3 text-[14.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: accent,
                }}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
