import ModeBadge from "../ui/ModeBadge";

export default function PageHeader({ title, subtitle, action, showBadge = true }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-cream-50">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-cream-300">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        {showBadge && <ModeBadge className="hidden sm:inline-flex" />}
        {action}
      </div>
    </header>
  );
}
