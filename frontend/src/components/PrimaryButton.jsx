import { ArrowRight, LoaderCircle } from "lucide-react";

export default function PrimaryButton({ children, loading = false, disabled = false, type = "submit", className = "" }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#197d68] to-[#238e74] px-5 py-3 text-sm font-semibold text-white shadow-[0_9px_18px_rgba(31,128,105,0.19)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_13px_25px_rgba(31,128,105,0.25)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#238e74]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      <span>{children}</span>
      {!loading && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />}
    </button>
  );
}
