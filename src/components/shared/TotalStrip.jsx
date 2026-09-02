import { cardClass } from "../ui/Card";
import AnimatedNumber from "../ui/AnimatedNumber";

export default function TotalStrip({ label, value, icon: Icon, tone = "saffron", count }) {
  const tones = {
    saffron: "from-saffron-500/20 text-saffron-300",
    emerald: "from-emerald-500/20 text-emerald-300",
  };
  return (
    <div className={`${cardClass} relative overflow-hidden p-5`}>
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-b ${tones[tone]} to-transparent blur-2xl`}
      />
      <div className="relative flex items-center gap-3">
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] ${tones[tone].split(" ")[1]}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <div>
          <p className="text-xs font-medium text-cream-300">{label}</p>
          <p className="mt-0.5 text-2xl font-extrabold text-cream-50">
            <AnimatedNumber value={value} />
          </p>
        </div>
      </div>
      {typeof count === "number" && (
        <p className="relative mt-2 text-xs text-cream-300">
          {count} {count === 1 ? "record" : "records"}
        </p>
      )}
    </div>
  );
}
