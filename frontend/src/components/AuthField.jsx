const inputClasses = "block w-full rounded-xl border border-[#dfe8e3] bg-white px-4 py-[13px] text-sm text-[#1b332d] shadow-[0_2px_5px_rgba(25,55,45,0.02)] outline-none transition duration-200 placeholder:text-[#a1ada7] hover:border-[#c4d9cf] focus:border-[#23856f] focus:ring-4 focus:ring-[#23856f]/10 disabled:cursor-not-allowed disabled:bg-[#f5f7f5] disabled:opacity-70";

export { inputClasses };

export default function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  disabled = false,
  error = "",
  hint = "",
  inputMode,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-[#304940]">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClasses} ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10" : ""}`}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-2 text-xs leading-5 text-[#84938c]">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
