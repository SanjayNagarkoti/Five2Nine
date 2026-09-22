import { useState } from "react";
import {
  Eye,
  EyeOff,
  Hammer,
  Search,
  ArrowRight,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  authenticateUser,
} from "../service/authService";

export default function SignupPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("freelancer");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFreelancer = role === "freelancer";

  const accent = isFreelancer ? "#1F8A70" : "#C9762B";
  const accentSoft = isFreelancer ? "#E4F3EE" : "#FBEADC";

  const passwordsMatch =
    form.password === form.confirmPassword;

  const passwordStrength = (() => {
    const password = form.password;

    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  })();

  const strengthLabel = [
    "",
    "Weak",
    "Okay",
    "Good",
    "Strong",
  ][passwordStrength];

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

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register user
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: role.toUpperCase(),
      });

      // 2. Automatically login after successful signup
      const loginResponse = await authenticateUser({
        email: form.email.trim(),
        password: form.password,
      });

      // 3. Save authentication data
      localStorage.setItem("token", loginResponse.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: loginResponse.name,
          email: loginResponse.email,
          role: loginResponse.role,
        })
      );

      // 4. Go directly to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
            "Unable to create your account. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E5DA] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[1200px] min-h-[700px] grid lg:grid-cols-2 bg-[#FAF8F3] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(27,33,64,0.12)]">

        {/* LEFT */}
        <div className="hidden lg:flex bg-[#1B2140] text-white p-12 flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent, transparent 39px, #ffffff 39px, #ffffff 40px)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: accent }}
              >
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
          </div>

          <div className="relative z-10 max-w-md">
            <p
              className="uppercase text-xs tracking-[0.2em] mb-4"
              style={{ color: accent }}
            >
              {isFreelancer
                ? "For independents"
                : "For clients"}
            </p>

            <h1
              className="text-5xl leading-tight mb-6"
              style={{
                fontFamily: "'Fraunces', serif",
              }}
            >
              {isFreelancer ? (
                <>
                  Your work,
                  <br />
                  your terms.
                </>
              ) : (
                <>
                  Find the right
                  <br />
                  person for the job.
                </>
              )}
            </h1>

            <p className="text-[#B8BCD4] leading-7">
              {isFreelancer
                ? "Showcase your skills, discover projects and work directly with clients."
                : "Post your requirements, discover freelancers and negotiate the work that fits you."}
            </p>
          </div>

          <p className="relative z-10 text-[#7C81A6] text-sm">
            Freelance. Hire. Negotiate. Work.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-[430px]">

            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: accent }}
              >
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
              Create your account
            </h2>

            <p className="text-sm text-[#8288A8] mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium underline text-[#1F8A70]"
              >
                Login
              </Link>
            </p>

            {/* ROLE */}
            <div className="mt-7">
              <p className="text-xs uppercase tracking-wide text-[#8288A8] mb-3">
                I want to
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className="rounded-xl border-2 p-4 text-left transition"
                  style={{
                    borderColor: isFreelancer
                      ? accent
                      : "#E7E5DD",
                    backgroundColor: isFreelancer
                      ? accentSoft
                      : "white",
                  }}
                >
                  <Hammer
                    size={19}
                    style={{
                      color: isFreelancer
                        ? accent
                        : "#9CA0A8",
                    }}
                  />

                  <p className="font-semibold text-[#1B2140] mt-3">
                    Find work
                  </p>

                  <p className="text-xs text-[#8288A8] mt-1">
                    I'm a freelancer
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className="rounded-xl border-2 p-4 text-left transition"
                  style={{
                    borderColor: !isFreelancer
                      ? accent
                      : "#E7E5DD",
                    backgroundColor: !isFreelancer
                      ? accentSoft
                      : "white",
                  }}
                >
                  <Search
                    size={19}
                    style={{
                      color: !isFreelancer
                        ? accent
                        : "#9CA0A8",
                    }}
                  />

                  <p className="font-semibold text-[#1B2140] mt-3">
                    Hire talent
                  </p>

                  <p className="text-xs text-[#8288A8] mt-1">
                    I'm a client
                  </p>
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              <input
                type="text"
                required
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Full name"
                className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F8A70]"
              />

              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Email address"
                className="w-full rounded-lg border border-[#E7E5DD] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F8A70]"
              />

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Password"
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

              {form.password && (
                <div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-1 flex-1 rounded-full"
                        style={{
                          backgroundColor:
                            item < passwordStrength
                              ? accent
                              : "#E7E5DD",
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#8288A8] mt-2">
                    {strengthLabel}
                  </p>
                </div>
              )}

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  required
                  value={form.confirmPassword}
                  onChange={handleChange(
                    "confirmPassword"
                  )}
                  placeholder="Confirm password"
                  className={`w-full rounded-lg border bg-white px-4 py-3 pr-11 text-sm outline-none ${
                    form.confirmPassword &&
                    !passwordsMatch
                      ? "border-red-500"
                      : "border-[#E7E5DD]"
                  }`}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  !passwordsMatch ||
                  !form.password
                }
                className="w-full rounded-lg py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  backgroundColor: accent,
                }}
              >
                {loading
                  ? "Creating account..."
                  : isFreelancer
                  ? "Create freelancer account"
                  : "Create client account"}

                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="text-xs text-[#A3A79A] mt-5 text-center">
              By continuing, you agree to Five2Nine's
              Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}