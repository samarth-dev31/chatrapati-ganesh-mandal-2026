import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "../../lib/format";

/**
 * Counts up/down to `value` over ~500ms. Falls back to the final value
 * instantly when the user prefers reduced motion.
 */
export default function AnimatedNumber({ value, className = "" }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const to = Number(value) || 0;
    if (reduce || from === to) {
      setDisplay(to);
      fromRef.current = to;
      return undefined;
    }
    const duration = 500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>{formatCurrency(Math.round(display))}</span>
  );
}
