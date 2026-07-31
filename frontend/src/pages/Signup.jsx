import { useState } from "react";
import { Eye, EyeOff, Hammer, Search, ArrowRight, Check } from "lucide-react";
import { registerUser } from "../service/authService";
import { Link } from "react-router-dom";
export default function SignupPage() {
  const [role, setRole] = useState("freelancer"); // "freelancer" | "client"
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isFreelancer = role === "freelancer";
  const accent = isFreelancer ? "#1F8A70" : "#C9762B";
  const accentSoft = isFreelancer ? "#E4F3EE" : "#FBEADC";
  const passwordsMatch = form.confirmPassword === "" || form.password === form.confirmPassword;
  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["Too short", "Weak", "Okay", "Good", "Strong"][passwordStrength];

  const handleChange = (field) => (e) => {

  if (field === "email") {
    setEmailError("");
  }

  setForm((f) => ({
    ...f,
    [field]: e.target.value,
  }));
};

 const handleSubmit = async (e) => {
  e.preventDefault();
  setEmailError("");

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const signupDto = {
    name: form.name,
    email: form.email,
    password: form.password,
    role: role.toUpperCase(),
  };

  try {

    const response = await registerUser(signupDto);

    console.log(response);

    setSubmitted(true);

}
catch (error) {

    if (error.response) {
        setEmailError(error.response.data);

    } else {

        console.log(error);

    }

}
};

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#E9E5DA]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="w-full max-w-[1360px] min-h-screen flex bg-[#FAF8F3] lg:shadow-[0_0_80px_rgba(27,33,64,0.12)]">

      {/* LEFT PANEL — brand / role narrative */}
      <div
        className="hidden lg:flex lg:w-[44%] flex-col relative overflow-hidden transition-colors duration-500"
        style={{ backgroundColor: "#1B2140" }}
      >
        {/* Ledger-line texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent, transparent 39px, #ffffff 39px, #ffffff 40px)",
          }}
        />

        <div className="relative z-10 px-12 pt-12">
          <div className="flex items-center gap-2 text-[#FAF8F3]">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors duration-500"
              style={{ backgroundColor: accent }}
            >
              <span className="text-[#1B2140] font-bold text-sm">W</span>
            </div>
            <span className="text-lg tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
              Wharf
            </span>
          </div>
        </div>

        {/* Hero + testimonial cluster together, vertically centered as one group */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-14 px-12 py-16">
          <div>
            <p
              className="uppercase tracking-[0.2em] text-xs mb-4 transition-colors duration-500"
              style={{ color: accent }}
            >
              {isFreelancer ? "For independents" : "For teams hiring"}
            </p>
            <h1
              className="text-[2.75rem] leading-[1.08] text-[#FAF8F3] mb-6"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
            >
              {isFreelancer ? (
                <>Your work,<br />on your terms.</>
              ) : (
                <>Find the hands<br />for the job.</>
              )}
            </h1>
            <p className="text-[#B8BCD4] text-[15px] leading-relaxed max-w-sm mb-10">
              {isFreelancer
                ? "Set your rate, pick your clients, build a portfolio that does the talking. No middle management, just the work."
                : "Post a brief, review real portfolios, and hire someone who's already done exactly this before."}
            </p>

            <ul className="space-y-3">
              {(isFreelancer
                ? ["Keep 100% of your rate", "Get paid on delivery, not on chase", "Build a public track record"]
                : ["Vetted freelancers only", "Compare bids side by side", "Escrowed payments, no surprises"]
              ).map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#E7E8F2] text-sm">
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500"
                    style={{ backgroundColor: accent }}
                  >
                    <Check size={11} strokeWidth={3} className="text-[#1B2140]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="h-px w-full bg-[#333A5C] mb-6" />
            <p className="text-[#7C81A6] text-xs leading-relaxed max-w-sm">
              "Switched over from three separate freelance apps to just this one. Haven't looked back."
            </p>
            <p className="text-[#B8BCD4] text-xs mt-2">— Priya N., Product Designer</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div
              className="w-7 h-7 rounded-sm flex items-center justify-center transition-colors duration-500"
              style={{ backgroundColor: accent }}
            >
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-base tracking-tight text-[#1B2140]" style={{ fontFamily: "'Fraunces', serif" }}>
              Wharf
            </span>
          </div>

          {submitted ? (
            <div className="py-10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-500"
                style={{ backgroundColor: accentSoft }}
              >
                <Check size={22} style={{ color: accent }} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl text-[#1B2140] mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
                You're in, {form.name.split(" ")[0] || "there"}.
              </h2>
              <p className="text-[#6B7094] text-sm leading-relaxed">
                We've sent a confirmation to <span className="text-[#1B2140]">{form.email || "your inbox"}</span>.
                Verify it to activate your {isFreelancer ? "freelancer" : "client"} account.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-sm font-medium underline underline-offset-4 decoration-1"
                style={{ color: accent }}
              >
                Back to form
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-[1.75rem] text-[#1B2140] mb-1.5" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}>
                Create your account
              </h2>
              <p className="text-[#8288A8] text-sm mb-7">
                Already have one?{" "}
                <Link
                  to="/login"
                  className="text-[#0000ff] font-medium underline underline-offset-2 decoration-[#D8DAE8]"
                >
                  Login
                </Link>
              </p>

              {/* Role selector */}
              <div className="mb-7">
                <p className="text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-2.5">I'm here to</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("freelancer")}
                    className="group relative rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200"
                    style={{
                      borderColor: isFreelancer ? accent : "#E7E5DD",
                      backgroundColor: isFreelancer ? accentSoft : "transparent",
                    }}
                  >
                    <Hammer
                      size={18}
                      style={{ color: isFreelancer ? accent : "#A3A79A" }}
                      className="mb-2"
                      strokeWidth={2}
                    />
                    <p className="text-[13.5px] font-semibold text-[#1B2140] leading-tight">Find work</p>
                    <p className="text-[11.5px] text-[#8288A8] mt-0.5">I'm a freelancer</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className="group relative rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200"
                    style={{
                      borderColor: !isFreelancer ? accent : "#E7E5DD",
                      backgroundColor: !isFreelancer ? accentSoft : "transparent",
                    }}
                  >
                    <Search
                      size={18}
                      style={{ color: !isFreelancer ? accent : "#A3A79A" }}
                      className="mb-2"
                      strokeWidth={2}
                    />
                    <p className="text-[13.5px] font-semibold text-[#1B2140] leading-tight">Hire talent</p>
                    <p className="text-[11.5px] text-[#8288A8] mt-0.5">I'm looking to hire</p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Jordan Rivera"
                    className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-2"
                    style={{ borderColor: undefined }}
                    onFocus={(e) => (e.target.style.borderColor = accent)}
                    onBlur={(e) => (e.target.style.borderColor = "#E7E5DD")}
                  />
                </div>

                <div>
  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
    Email
  </label>

  <input
    type="email"
    required
    value={form.email}
    onChange={handleChange("email")}
    placeholder={isFreelancer ? "you@yourwork.com" : "you@company.com"}
    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors ${
      emailError ? "border-red-500" : "border-[#E7E5DD]"
    }`}
  />

  {emailError && (
    <p className="text-red-500 text-xs mt-1">
      {emailError}
    </p>
  )}
</div>

                <div>
                  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder="At least 8 characters"
                      className="w-full rounded-lg border border-[#E7E5DD] bg-white px-3.5 py-2.5 pr-10 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors focus:border-2"
                      onFocus={(e) => (e.target.style.borderColor = accent)}
                      onBlur={(e) => (e.target.style.borderColor = "#E7E5DD")}
                    />
                    <button
  type="button"
  onClick={() => setShowPassword((s) => !s)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A79A] hover:text-[#6B7094]"
>
  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
</button>
                  </div>

                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                            style={{
                              backgroundColor: i < passwordStrength ? accent : "#E7E5DD",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] text-[#8288A8] mt-1.5">{strengthLabel}</p>
                    </div>
                  )}
                </div>
                <div>
  <label className="block text-xs font-medium text-[#8288A8] uppercase tracking-wide mb-1.5">
    Confirm Password
  </label>

  <input
    type={showPassword ? "text" : "password"}
    required
    value={form.confirmPassword}
    onChange={handleChange("confirmPassword")}
    placeholder="Re-enter your password"
    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-[14.5px] text-[#1B2140] placeholder-[#B4B7C6] outline-none transition-colors ${
      !passwordsMatch ? "border-red-500" : "border-[#E7E5DD]"
    }`}
  />

  {!passwordsMatch && (
    <p className="text-red-500 text-xs mt-1">
      Passwords do not match.
    </p>
  )}
</div>
                

                <button
  type="submit"
  disabled={!passwordsMatch}
  className="w-full mt-2 rounded-lg py-3 text-[14.5px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  style={{ backgroundColor: accent }}
>
  {isFreelancer
    ? "Create freelancer account"
    : "Create hiring account"}

  <ArrowRight size={16} />
</button>
              </form>

              <p className="text-[11.5px] text-[#A3A79A] mt-5 leading-relaxed">
                By continuing you agree to Wharf's Terms of Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}