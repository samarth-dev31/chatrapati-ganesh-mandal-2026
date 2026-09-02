import { ShieldCheck, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ModeBadge({ className = "" }) {
  const { isEditor } = useAuth();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        isEditor
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-white/10 bg-white/5 text-cream-300"
      } ${className}`}
    >
      {isEditor ? <ShieldCheck className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      {isEditor ? "Editor" : "View only"}
    </span>
  );
}
