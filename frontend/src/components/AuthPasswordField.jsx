import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { inputClasses } from "./AuthField";

export default function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  required = true,
  disabled = false,
  error = "",
  hint = "",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-[#304940]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`${inputClasses} pr-12 ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-[#81928a] transition hover:bg-[#eff6f1] hover:text-[#287b67] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#23856f]/15 disabled:opacity-50"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-[#84938c]">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
