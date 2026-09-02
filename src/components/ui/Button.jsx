import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-gradient-to-b from-saffron-400 to-saffron-600 text-ink-950 shadow-glow hover:from-saffron-300 hover:to-saffron-500 active:from-saffron-500 active:to-saffron-700 font-semibold",
  secondary:
    "bg-ink-800 text-cream-100 border border-white/10 hover:bg-ink-700 active:bg-ink-800",
  ghost: "bg-transparent text-cream-200 hover:bg-white/5 active:bg-white/10",
  danger:
    "bg-red-500/15 text-red-200 border border-red-500/30 hover:bg-red-500/25 active:bg-red-500/20",
  gold: "bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 font-semibold hover:from-gold-200 hover:to-gold-400",
};

const SIZES = {
  sm: "h-9 px-3 text-sm rounded-xl gap-1.5",
  md: "h-11 px-4 text-sm rounded-xl2 gap-2",
  lg: "h-12 px-5 text-base rounded-xl2 gap-2",
  icon: "h-10 w-10 rounded-xl justify-center",
};

const Button = forwardRef(function Button(
  { as: Comp = "button", variant = "primary", size = "md", loading = false, className = "", children, disabled, ...props },
  ref,
) {
  return (
    <Comp
      ref={ref}
      disabled={Comp === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={`inline-flex select-none items-center justify-center whitespace-nowrap transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${
        VARIANTS[variant]
      } ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Comp>
  );
});

export default Button;
