import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { authenticateUser } from "../service/authService";

export default function Loginpage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const accent = "#1F8A70";

  const handleChange = (field) => (e) => {
    setError("");

    setForm((previous) => ({
      ...previous,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await authenticateUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.name,
          email: response.email,
          role: response.role,
        })
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E5DA] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[1200px] min-h-[680px] grid lg:grid-cols-2 bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(27,33,64,0.12)]">

        {/* LEFT */}
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
              Welcome back
            </p>

            <h1
              className="text-5xl leading-tight"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              Get back to
              <br />
              getting things done.
            </h1>

            <p className="text-[#B8BCD4] mt-6 max-w-md leading-7">
              Manage your services, projects, proposals,
              negotiations and orders from one place.
            </p>
          </div>

          <p className="text-[#7C81A6] text-sm">
            Freelance. Hire. Negotiate. Work.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12">
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

            <h2
              className="text-3xl text-[#1B2140]"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              Welcome back
            </h2>

            <p className="text-sm text-[#8288A8] mt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#1F8A70] font-medium underline"
              >
                Sign up
              </Link>
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 mt-8"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#8288A8] mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="Enter your registered email"
                  className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F8A70]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#8288A8] mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 pr-11 text-sm outline-none focus:border-[#1F8A70]"
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

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#6B7094] hover:text-[#1F8A70]"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
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
                  ? "Logging in..."
                  : "Login"}

                {!loading && (
                  <ArrowRight size={16} />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}