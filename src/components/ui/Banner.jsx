import { Info, AlertTriangle, RefreshCw } from "lucide-react";

const TONES = {
  info: "border-gold-400/25 bg-gold-400/10 text-cream-100",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  error: "border-red-500/30 bg-red-500/10 text-red-100",
};

export default function Banner({ tone = "info", title, children, onRetry }) {
  const Icon = tone === "error" ? AlertTriangle : Info;
  return (
    <div className={`flex items-start gap-3 rounded-xl2 border px-4 py-3 text-sm ${TONES[tone]}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <p className="mt-0.5 text-[13px] opacity-90">{children}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-xs font-medium transition hover:bg-white/10"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      )}
    </div>
  );
}
