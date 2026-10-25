import { useState } from "react";
import { Fingerprint, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser } from "../service/authService";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import AuthPasswordField from "../components/AuthPasswordField";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setError("");
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authenticateUser({ email: form.email.trim(), password: form.password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({ name: response.name, email: response.email, role: response.role }));
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      console.error("Login error:", requestError);
      const message = typeof requestError.response?.data === "string"
        ? requestError.response.data
        : requestError.response?.data?.message || "That email and password combination didn’t work. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <AuthLayout
      eyebrow="WELCOME BACK"
      headline={<>Your next great<br />work awaits.</>}
      description="Pick up where you left off. Your projects, conversations, and collaborations are just a sign-in away."
    >
      <div className="f2n-fade-up">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#edf8f2] px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-[#287a65]"><Fingerprint size={14} /> YOUR WORKSPACE</div>
          <h2 className="font-display text-[2.2rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d] sm:text-[2.5rem]">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-[#778982]">New to Five2Nine? <Link to="/signup" className="font-semibold text-[#197d68] underline-offset-4 hover:underline">Create an account</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField id="login-email" label="Email address" type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" />
          <AuthPasswordField id="login-password" label="Password" value={form.password} onChange={handleChange("password")} placeholder="Enter your password" autoComplete="current-password" />

          <div className="-mt-1 flex justify-end">
            <Link to="/forgot-password" className="text-[13px] font-semibold text-[#397d6b] decoration-[#9ccbbc] underline-offset-4 transition hover:text-[#145f50] hover:underline">Forgot password?</Link>
          </div>

          {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">{error}</div>}
          <PrimaryButton loading={loading} disabled={!form.email.trim() || !form.password}>{loading ? "Signing you in…" : "Sign in to Five2Nine"}</PrimaryButton>
        </form>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e8eee9] bg-[#f8faf8] p-4">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-[#36836f] shadow-sm ring-1 ring-[#e5eee8]"><ShieldCheck size={16} /></span>
          <div><p className="text-xs font-semibold text-[#395348]">Your account stays yours</p><p className="mt-1 text-xs leading-5 text-[#87958e]">Never share your password or one-time verification codes with anyone.</p></div>
        </div>
      </div>
    </AuthLayout>
  );
}
