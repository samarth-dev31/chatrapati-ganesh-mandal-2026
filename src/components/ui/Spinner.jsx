import { Loader2 } from "lucide-react";

export default function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-cream-300 ${className}`} role="status">
      <Loader2 className="h-7 w-7 animate-spin text-saffron-400" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
