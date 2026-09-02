import { motion } from "framer-motion";
import { MANDAL_NAME, FESTIVAL_LINE, GREETING } from "../../lib/constants";
import ModeBadge from "../ui/ModeBadge";

export default function BrandHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-gradient-to-b from-saffron-400 to-saffron-600 text-xl shadow-glow">
            🪷
          </span>
          <div className="leading-tight">
            <p className="font-deva text-sm text-gold-300">{GREETING}</p>
            <h1 className="mt-0.5 text-lg font-extrabold text-cream-50 sm:text-xl">{MANDAL_NAME}</h1>
          </div>
        </div>
        <ModeBadge className="mt-1 shrink-0" />
      </div>
      <p className="font-deva mt-2 text-sm font-medium text-cream-300">{FESTIVAL_LINE}</p>
    </motion.header>
  );
}
