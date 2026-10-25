import { useState } from "react";
import { Check, Hammer, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, authenticateUser } from "../service/authService";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthPasswordField from "../components/AuthPasswordField";
import PrimaryButton from "../components/PrimaryButton";

const roles = [
  {
    id: "freelancer",
    title: "Find work",
    subtitle: "I’m an independent talent",
    Icon: Hammer,
    tint: "from-[#e8f7ee] to-[#eef8f3]",
  },
  {
    id: "client",
    title: "Hire talent",
    subtitle: "I have a project in mind",
    Icon: Search,
    tint: "from-[#edf1ff] to-[#f4f2ff]",
  },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("freelancer");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordStrength = (() => {
    if (!form.password) return 0;
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;
    return score;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["bg-[#e5ebe7]", "bg-rose-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"][passwordStrength];

  const handleChange = (field) => (event) => {
    setError("");
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Your passwords don’t match yet.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: role.toUpperCase(),
      });

      const loginResponse = await authenticateUser({
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("user", JSON.stringify({
        name: loginResponse.name,
        email: loginResponse.email,
        role: loginResponse.role,
      }));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      console.error("Signup error:", requestError);
      const message = typeof requestError.response?.data === "string"
        ? requestError.response.data
        : requestError.response?.data?.message || "We couldn’t create your account. Please check your details and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="START YOUR NEXT CHAPTER"
      headline={<>Good work<br />starts with you.</>}
      description="Create your Five2Nine account and connect with people who value great work, clear goals, and better collaboration."
    >
      <div className="f2n-fade-up">
        <div className="mb-7">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#edf8f2] px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#287a65]">
            <Sparkles size={13} /> YOUR NEXT CHAPTER
          </div>
          <h2 className="font-display text-[2.15rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d] sm:text-[2.45rem]">Create your account</h2>
          <p className="mt-2 text-sm leading-6 text-[#778982]">Already have an account? <Link to="/login" className="font-semibold text-[#197d68] decoration-[#9ccbbc] underline-offset-4 hover:underline">Log in</Link></p>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-[13px] font-semibold text-[#304940]">How will you use Five2Nine?</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roles.map(({ id, title, subtitle, Icon, tint }) => {
              const selected = role === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  aria-pressed={selected}
                  className={`f2n-tilt relative rounded-2xl border p-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#23856f]/15 ${selected ? "border-[#6ab59d] bg-[#f4fbf7] shadow-[0_8px_22px_rgba(31,128,105,0.09)]" : "border-[#e1e9e4] bg-white hover:-translate-y-0.5 hover:border-[#c6dbd0] hover:shadow-md"}`}
                >
                  {selected && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#20836c] text-white"><Check size={12} strokeWidth={3} /></span>}
                  <span className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${tint} text-[#287b67]`}><Icon size={19} /></span>
                  <span className="block text-sm font-bold text-[#213a32]">{title}</span>
                  <span className="mt-1 block pr-3 text-xs leading-5 text-[#85948d]">{subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField id="signup-name" label="Full name" value={form.name} onChange={handleChange("name")} placeholder="e.g. Alex Morgan" autoComplete="name" />
          <AuthField id="signup-email" label="Email address" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" />

          <div>
            <AuthPasswordField id="signup-password" label="Create password" value={form.password} onChange={handleChange("password")} placeholder="At least 8 characters" autoComplete="new-password" />
            {form.password && (
              <div className="mt-3" aria-live="polite">
                <div className="flex gap-1.5" aria-label={`Password strength: ${strengthLabel}`}>
                  {[0, 1, 2, 3].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step < passwordStrength ? strengthColor : "bg-[#e7eee9]"}`} />)}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#84938c]"><span>Use a mix of characters</span><span className={passwordStrength >= 3 ? "font-semibold text-[#168064]" : ""}>{strengthLabel}</span></div>
              </div>
            )}
          </div>

          <AuthPasswordField
            id="signup-confirm-password"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Enter it once more"
            autoComplete="new-password"
            error={form.confirmPassword && !passwordsMatch ? "These passwords don’t match." : ""}
          />

          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">{error}</div>}

          <div className="pt-1">
            <PrimaryButton loading={loading} disabled={!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword || !passwordsMatch}>
              {loading ? "Creating your account…" : role === "freelancer" ? "Create freelancer account" : "Create client account"}
            </PrimaryButton>
          </div>
        </form>

        <p className="mt-5 text-center text-[11px] leading-5 text-[#94a099]">By creating an account, you agree to Five2Nine’s <a href="/terms" className="font-medium text-[#60776d] underline underline-offset-2 hover:text-[#197d68]">Terms</a> and <a href="/privacy" className="font-medium text-[#60776d] underline underline-offset-2 hover:text-[#197d68]">Privacy Policy</a>.</p>
      </div>
    </AuthLayout>
  );
}
