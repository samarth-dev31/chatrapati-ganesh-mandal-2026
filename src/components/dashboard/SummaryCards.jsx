import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Scale, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cardClass } from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";

function balanceState(balance) {
  if (balance > 0)
    return {
      label: "In surplus",
      icon: ArrowUpRight,
      chip: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
      ring: "from-emerald-500/25",
    };
  if (balance < 0)
    return {
      label: "Over budget",
      icon: ArrowDownRight,
      chip: "bg-red-500/15 text-red-200 border-red-500/30",
      ring: "from-red-500/25",
    };
  return {
    label: "Breaking even",
    icon: Minus,
    chip: "bg-white/10 text-cream-200 border-white/15",
    ring: "from-gold-500/25",
  };
}

const fade = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

export default function SummaryCards({ totals }) {
  const state = balanceState(totals.balance);
  const StateIcon = state.icon;

  return (
    <div className="space-y-3">
      <motion.div
        custom={0}
        variants={fade}
        initial="hidden"
        animate="show"
        className={`${cardClass} relative overflow-hidden p-5`}
      >
        <div
          className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-b ${state.ring} to-transparent blur-2xl`}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 text-cream-300">
            <Scale className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">Current Balance</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${state.chip}`}
          >
            <StateIcon className="h-3.5 w-3.5" />
            {state.label}
          </span>
        </div>
        <p className="relative mt-3 text-[2.4rem] font-extrabold leading-none text-cream-50">
          <AnimatedNumber value={totals.balance} />
        </p>
        <p className="relative mt-2 text-xs text-cream-300">
          Collection minus expenses, calculated live from every record.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div custom={1} variants={fade} initial="hidden" animate="show" className={`${cardClass} p-4`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-3 text-xs font-medium text-cream-300">Total Collection</p>
          <p className="mt-1 text-xl font-bold text-cream-50">
            <AnimatedNumber value={totals.collection} />
          </p>
        </motion.div>

        <motion.div custom={2} variants={fade} initial="hidden" animate="show" className={`${cardClass} p-4`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron-500/15 text-saffron-300">
            <TrendingDown className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-3 text-xs font-medium text-cream-300">Total Expenses</p>
          <p className="mt-1 text-xl font-bold text-cream-50">
            <AnimatedNumber value={totals.expenses} />
          </p>
        </motion.div>
      </div>
    </div>
  );
}
