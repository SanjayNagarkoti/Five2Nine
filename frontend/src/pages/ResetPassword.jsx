import { useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../service/authService";
import AuthLayout from "../components/AuthLayout";
import AuthPasswordField from "../components/AuthPasswordField";
import PrimaryButton from "../components/PrimaryButton";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    if (status === "error") {
      setStatus("form");
      setMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("This password reset link is missing or invalid. Request a new link to continue.");
      return;
    }
    if (form.newPassword.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters for your new password.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus("error");
      setMessage("Your passwords don’t match yet.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: form.newPassword });
      setStatus("success");
    } catch (requestError) {
      console.error("Reset password error:", requestError);
      const errorMessage = typeof requestError.response?.data === "string"
        ? requestError.response.data
        : requestError.response?.data?.message || "This reset link may have expired. Request a fresh link and try again.";
      setMessage(errorMessage);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout eyebrow="ACCOUNT SECURITY" headline={<>Let’s secure<br />your account.</>} description="For your protection, a valid password-reset link is required before you can choose a new password.">
        <div className="f2n-fade-up">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100"><AlertCircle size={26} /></span>
          <h2 className="font-display text-[2.1rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d]">Reset link unavailable</h2>
          <p className="mt-3 text-sm leading-6 text-[#778982]">This link is incomplete or invalid. Request a fresh reset link to continue.</p>
          <Link to="/forgot-password" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-5 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:shadow-lg">Request a new link <RotateCcw size={16} /></Link>
          <p className="mt-5 text-center text-sm text-[#778982]">Remember your password? <Link to="/login" className="font-semibold text-[#197d68] underline-offset-4 hover:underline">Log in</Link></p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "success") {
    return (
      <AuthLayout eyebrow="ACCOUNT SECURITY" headline={<>You’re ready<br />for what’s next.</>} description="Your account is secured with your new password. Sign in to continue where you left off.">
        <div className="f2n-fade-up">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#dff6e9] to-[#eef7ef] text-[#20836b] shadow-sm ring-1 ring-[#d3ebdf]"><CheckCircle2 size={27} /></span>
          <h2 className="font-display text-[2.2rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d]">Password updated</h2>
          <p className="mt-3 text-sm leading-6 text-[#778982]">Your password has been changed successfully. You can now log in using your new password.</p>
          <Link to="/login" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-5 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:shadow-lg">Back to login <CheckCircle2 size={16} /></Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="ACCOUNT SECURITY" headline={<>A fresh start,<br />on your terms.</>} description="Choose a strong new password and you’ll be ready to get back to work in no time.">
      <div className="f2n-fade-up">
        <div className="mb-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e0f4e9] to-[#f0f5ec] text-[#21806a] ring-1 ring-[#d7eae0]"><ShieldCheck size={23} /></span>
          <h2 className="font-display text-[2.15rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d] sm:text-[2.35rem]">Create a new password</h2>
          <p className="mt-2 text-sm leading-6 text-[#778982]">Use at least 8 characters. A mix of letters, numbers, and symbols is stronger.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthPasswordField id="reset-new-password" label="New password" value={form.newPassword} onChange={handleChange("newPassword")} placeholder="Create a strong password" autoComplete="new-password" disabled={loading} />
          <AuthPasswordField id="reset-confirm-password" label="Confirm new password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} placeholder="Enter it once more" autoComplete="new-password" disabled={loading} error={form.confirmPassword && form.newPassword !== form.confirmPassword ? "These passwords don’t match." : ""} />

          {message && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">{message}</div>}
          <PrimaryButton loading={loading} disabled={!form.newPassword || !form.confirmPassword || form.newPassword !== form.confirmPassword}>{loading ? "Updating password…" : "Save new password"}</PrimaryButton>
        </form>

        <p className="mt-6 text-sm text-[#778982]">Remembered it? <Link to="/login" className="font-semibold text-[#197d68] underline-offset-4 hover:underline">Back to login</Link></p>
      </div>
    </AuthLayout>
  );
}
