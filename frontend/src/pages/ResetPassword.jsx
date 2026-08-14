import { useState } from "react";
import { ArrowRight, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../service/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();

  // Get token from:
  // /reset-password?token=abc123
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    setMessage("");

    // ----------------------------------------
    // Check token
    // ----------------------------------------

    if (!token) {
      setStatus("error");
      setMessage(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    // ----------------------------------------
    // Check passwords
    // ----------------------------------------

    if (form.newPassword !== form.confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    // ----------------------------------------
    // Basic password validation
    // ----------------------------------------

    if (form.newPassword.length < 8) {
      setStatus("error");
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const resetData = {
        token: token,
        newPassword: form.newPassword,
      };

      console.log("Reset password request:", {
        ...resetData,
        token: "[HIDDEN]",
      });

      const response = await resetPassword(resetData);

      console.log("Reset password response:", response);

      setStatus("success");

    } catch (error) {
      console.error("Reset password error:", error);

      let errorMessage =
        "Unable to reset your password. Please try again.";

      if (error.response) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage =
            "The reset link is invalid or has expired.";
        }
      } else {
        errorMessage =
          "Unable to connect to the server. Please try again later.";
      }

      setMessage(errorMessage);
      setStatus("error");

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

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

                <Check
                  size={28}
                  strokeWidth={2.5}
                  className="text-[#1F8A70]"
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
                Password changed.
              </h2>

              {/* MESSAGE */}

              <p className="text-[#8288A8] text-[15px] leading-6 mb-8">
                Your password has been successfully reset.
                You can now log in using your new password.
              </p>

              {/* LOGIN */}

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

  // =====================================================
  // ERROR SCREEN
  // =====================================================

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
                Reset link invalid.
              </h2>

              {/* MESSAGE */}

              <p className="text-[#8288A8] text-[15px] leading-6 mb-8">
                {message}
              </p>

              <div className="flex items-center gap-6">

                <button
                  onClick={() => {
                    setStatus("form");
                    setMessage("");
                  }}
                  className="text-[#1F8A70] font-medium text-[14.5px] underline underline-offset-4 decoration-[#A8D8CC]"
                >
                  Try Again
                </button>

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
      </div>
    );
  }

  // =====================================================
  // RESET PASSWORD FORM
  // =====================================================

  return (
    <div
      className="min-h-screen w-full flex justify-center bg-[#E9E5DA]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600&family=Inter:wght@400;500;600;700&display=swap');
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
              Create a new password
            </h2>

            {/* DESCRIPTION */}

            <p className="text-[#8288A8] text-sm mb-7">
              Enter a new password for your account.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NEW PASSWORD */}

              <div>

                <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    placeholder="Enter your new password"
                    disabled={loading}
                    className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 pr-11 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-[#1F8A70] disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8288A8]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="Confirm your new password"
                    disabled={loading}
                    className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 pr-11 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-[#1F8A70] disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8288A8]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* PASSWORD REQUIREMENT */}

              <p className="text-[#8288A8] text-xs">
                Password must contain at least 8 characters.
              </p>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-lg py-3 text-[14.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: accent,
                }}
              >

                {loading ? (
                  "Resetting..."
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={16} />
                  </>
                )}

              </button>

            </form>

            {/* BACK TO LOGIN */}

            <p className="text-[#8288A8] text-sm mt-6">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-[#1F8A70] font-medium underline underline-offset-2"
              >
                Back to Login
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}