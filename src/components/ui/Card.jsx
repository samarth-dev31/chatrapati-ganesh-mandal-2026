import { forwardRef } from "react";

export const cardClass =
  "rounded-xl2 border border-white/[0.06] bg-ink-900/80 shadow-card backdrop-blur-sm";

const Card = forwardRef(function Card({ as: Comp = "div", className = "", children, ...props }, ref) {
  return (
    <Comp ref={ref} className={`${cardClass} ${className}`} {...props}>
      {children}
    </Comp>
  );
});

export default Card;
