import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Bottom sheet on mobile, centered dialog on desktop.
 * Handles Escape, backdrop click, body scroll lock and basic focus handling.
 */
export default function Modal({ open, onClose, title, description, children, footer, size = "md" }) {
  const panelRef = useRef(null);
  const lastActive = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    lastActive.current = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    // Move focus into the dialog
    const t = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector(
        'input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      window.clearTimeout(t);
      lastActive.current?.focus?.();
    };
  }, [open, onClose]);

  const maxW = size === "lg" ? "sm:max-w-lg" : size === "sm" ? "sm:max-w-sm" : "sm:max-w-md";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 flex max-h-[92dvh] w-full ${maxW} flex-col overflow-hidden rounded-t-xl3 border border-white/10 bg-ink-900 shadow-card sm:rounded-xl3`}
          >
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/15 sm:hidden" />
            <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
              <div>
                {title && <h2 className="text-lg font-semibold text-cream-50">{title}</h2>}
                {description && <p className="mt-0.5 text-sm text-cream-300">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1.5 -mt-1 rounded-xl p-2 text-cream-300 transition hover:bg-white/5 hover:text-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-2">{children}</div>
            {footer && (
              <div className="border-t border-white/[0.06] bg-ink-900/95 px-5 py-4 pb-safe">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
