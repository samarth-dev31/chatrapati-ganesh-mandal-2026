import { AlertCircle } from "lucide-react";

const baseInput =
  "w-full rounded-xl2 border bg-ink-850 px-4 text-[15px] text-cream-50 placeholder:text-cream-300/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/70 focus:border-transparent disabled:opacity-60";

export function Field({ label, htmlFor, error, hint, required, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-cream-200">
          {label}
          {required && <span className="ml-0.5 text-saffron-400">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-300" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-cream-300/70">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ error, className = "", ...props }) {
  return (
    <input
      className={`${baseInput} h-12 ${error ? "border-red-500/60" : "border-white/10"} ${className}`}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
}

export function TextArea({ error, className = "", ...props }) {
  return (
    <textarea
      rows={3}
      className={`${baseInput} resize-none py-3 ${error ? "border-red-500/60" : "border-white/10"} ${className}`}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
}

export function AmountInput({ error, className = "", ...props }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-medium text-cream-300">
        ₹
      </span>
      <input
        inputMode="decimal"
        type="number"
        min="0"
        step="1"
        className={`${baseInput} h-12 pl-9 tabular-nums ${error ? "border-red-500/60" : "border-white/10"} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
    </div>
  );
}

export function DateInput({ error, className = "", ...props }) {
  return (
    <input
      type="date"
      className={`${baseInput} h-12 [color-scheme:dark] ${error ? "border-red-500/60" : "border-white/10"} ${className}`}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  );
}

/**
 * Tappable option chips — better on mobile than a native <select> for a short
 * fixed list. Renders an accessible radio group.
 */
export function OptionGrid({ options, value, onChange, label, columns = 2 }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`grid gap-2 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-2 rounded-xl2 border px-3 py-2.5 text-left text-sm transition-all active:scale-[0.98] ${
              active
                ? "border-saffron-400/60 bg-saffron-500/15 text-cream-50 shadow-glow"
                : "border-white/10 bg-ink-850 text-cream-200 hover:border-white/20"
            }`}
          >
            {Icon && (
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? "text-saffron-300" : "text-cream-300"}`}
                aria-hidden="true"
              />
            )}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
