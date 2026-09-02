import { motion } from "framer-motion";
import { Pencil, Trash2, StickyNote } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/format";

/**
 * One expense or collection, rendered as a clean list card.
 * Editor actions (edit / delete) only render when `editable` is true.
 */
export default function RecordRow({
  icon: Icon,
  iconTone = "text-saffron-300 bg-saffron-500/15",
  title,
  tags = [],
  note,
  addedBy,
  date,
  amount,
  amountPrefix = "",
  amountTone = "text-cream-50",
  editable = false,
  onEdit,
  onDelete,
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl2 border border-white/[0.06] bg-ink-900/70 p-3.5"
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-[15px] font-semibold text-cream-50">{title}</p>
            <p className={`shrink-0 text-[15px] font-bold tabular-nums ${amountTone}`}>
              {amountPrefix}
              {formatCurrency(amount)}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-cream-300">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md bg-white/[0.06] px-1.5 py-0.5 font-medium text-cream-200"
              >
                {t}
              </span>
            ))}
            <span>{formatDate(date)}</span>
            {addedBy && (
              <>
                <span aria-hidden="true">·</span>
                <span>by {addedBy}</span>
              </>
            )}
          </div>

          {note && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-cream-300/80">
              <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{note}</span>
            </p>
          )}

          {editable && (
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-cream-200 transition hover:bg-ink-700"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}
