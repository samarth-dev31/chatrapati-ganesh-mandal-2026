import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const TONES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  error: "border-red-500/30 bg-red-500/10 text-red-100",
  info: "border-gold-400/30 bg-gold-400/10 text-cream-100",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", duration = 3200) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      toast: push,
      success: (m, d) => push(m, "success", d),
      error: (m, d) => push(m, "error", d ?? 4200),
      info: (m, d) => push(m, "info", d),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-4 pt-3 pt-safe"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-card backdrop-blur-md ${
                  TONES[t.type] || TONES.info
                }`}
                role={t.type === "error" ? "alert" : "status"}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p className="flex-1 text-sm leading-snug">{t.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="-mr-1 rounded-lg p-1 text-current/70 transition hover:bg-white/10 hover:text-current"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
