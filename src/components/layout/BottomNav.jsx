import { motion } from "framer-motion";
import { NAV_ITEMS } from "./navItems";

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-ink-950/85 backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-safe pt-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(item.key)}
                aria-current={active ? "page" : undefined}
                className="group relative flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-x-2 top-0 h-full rounded-xl bg-gradient-to-b from-saffron-500/20 to-transparent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative h-[22px] w-[22px] transition-colors ${
                    active ? "text-saffron-400" : "text-cream-300 group-hover:text-cream-100"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`relative transition-colors ${
                    active ? "text-saffron-300" : "text-cream-300 group-hover:text-cream-100"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
