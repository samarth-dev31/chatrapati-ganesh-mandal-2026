import { ShieldCheck, Eye } from "lucide-react";
import { NAV_ITEMS } from "./navItems";
import { MANDAL_NAME, FESTIVAL_LINE } from "../../lib/constants";
import { useAuth } from "../../context/AuthContext";

export default function DesktopSidebar({ current, onNavigate }) {
  const { isEditor } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/[0.06] bg-ink-900/60 px-4 py-6 md:flex lg:w-72">
      <div className="px-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-gradient-to-b from-saffron-400 to-saffron-600 text-lg">
            🪷
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold text-cream-50">{MANDAL_NAME}</p>
            <p className="font-deva text-xs text-gold-300">{FESTIVAL_LINE}</p>
          </div>
        </div>
      </div>

      <nav aria-label="Primary" className="mt-8 flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-saffron-500/20 to-transparent text-cream-50"
                      : "text-cream-300 hover:bg-white/5 hover:text-cream-100"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${active ? "text-saffron-400" : ""}`}
                    aria-hidden="true"
                  />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-saffron-400" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`mt-4 flex items-center gap-2 rounded-xl2 border px-3 py-2.5 text-xs font-medium ${
          isEditor
            ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
            : "border-white/10 bg-ink-850 text-cream-300"
        }`}
      >
        {isEditor ? <ShieldCheck className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {isEditor ? "Editor mode active" : "View-only mode"}
      </div>
    </aside>
  );
}
