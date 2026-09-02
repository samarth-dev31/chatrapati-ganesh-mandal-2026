export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl2 border border-dashed border-white/10 bg-ink-900/40 px-6 py-14 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-saffron-500/20 to-gold-500/10 text-saffron-300">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-cream-100">{title}</h3>
      {description && <p className="mt-1.5 max-w-xs text-sm text-cream-300">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
