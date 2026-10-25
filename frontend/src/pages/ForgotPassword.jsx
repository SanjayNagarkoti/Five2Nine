import { useState } from "react";
import { AlertCircle, MailCheck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../service/authService";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import PrimaryButton from "../components/PrimaryButton";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await requestPasswordReset(email.trim());
      // Keep the confirmation generic so the UI doesn't disclose whether an email is registered.
      setMessage(`If an account exists for ${email.trim()}, password-reset instructions will be sent.`);
      setStatus("success");
    } catch (requestError) {
      console.error("Password reset error:", requestError);
      const errorMessage = typeof requestError.response?.data === "string"
        ? requestError.response.data
        : requestError.response?.data?.message || "We couldn’t send the request right now. Please try again.";
      setMessage(errorMessage);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <AuthLayout eyebrow="ACCOUNT RECOVERY" headline={<>A small step<br />back to you.</>} description="We’ll help you get back into your workspace with a secure password-reset flow.">
        <div className="f2n-fade-up">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#dff6e9] to-[#eef7ef] text-[#20836b] shadow-sm ring-1 ring-[#d3ebdf]"><MailCheck size={27} /></span>
          <h2 className="font-display text-[2.25rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d]">Check your inbox</h2>
          <p className="mt-3 text-sm leading-6 text-[#778982]">{message}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => { setStatus("form"); setMessage(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#dfe8e3] bg-white px-4 text-sm font-semibold text-[#466258] transition hover:-translate-y-0.5 hover:border-[#bcd7ca] hover:shadow-md"><RotateCcw size={15} /> Change email</button>
            <Link to="/login" className="text-sm font-semibold text-[#197d68] underline-offset-4 hover:underline">Back to login</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (status === "error") {
    return (
      <AuthLayout eyebrow="ACCOUNT RECOVERY" headline={<>Let’s get you<br />back on track.</>} description="Password recovery should be straightforward. Try again or return to sign in.">
        <div className="f2n-fade-up">
          <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100"><AlertCircle size={27} /></span>
          <h2 className="font-display text-[2.1rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d]">Request not sent</h2>
          <p role="alert" className="mt-3 text-sm leading-6 text-[#778982]">{message}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => { setStatus("form"); setMessage(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#197d68] px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-[#146b5a]"><RotateCcw size={15} /> Try again</button>
            <Link to="/login" className="text-sm font-semibold text-[#197d68] underline-offset-4 hover:underline">Back to login</Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout eyebrow="ACCOUNT RECOVERY" headline={<>A fresh start<br />is one email away.</>} description="Forgot your password? It happens. Tell us the email connected to your account and we’ll guide you from there.">
      <div className="f2n-fade-up">
        <div className="mb-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e0f4e9] to-[#f0f5ec] text-[#21806a] ring-1 ring-[#d7eae0]"><MailCheck size={23} /></span>
          <h2 className="font-display text-[2.15rem] font-medium leading-tight tracking-[-0.05em] text-[#1b332d] sm:text-[2.35rem]">Reset your password</h2>
          <p className="mt-2 text-sm leading-6 text-[#778982]">Enter your registered email and we’ll send you a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField id="forgot-email" label="Email address" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(""); }} placeholder="you@example.com" autoComplete="email" disabled={loading} />
          <PrimaryButton loading={loading} disabled={!email.trim()}>{loading ? "Sending reset link…" : "Send reset link"}</PrimaryButton>
        </form>

        <p className="mt-6 text-sm text-[#778982]">Remember your password? <Link to="/login" className="font-semibold text-[#197d68] underline-offset-4 hover:underline">Back to login</Link></p>
      </div>
    </AuthLayout>
  );
}
