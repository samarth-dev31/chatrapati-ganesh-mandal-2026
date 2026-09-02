import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { History, ReceiptText, HandCoins } from "lucide-react";
import RecordRow from "../shared/RecordRow";
import EmptyState from "../ui/EmptyState";
import { categoryMeta, paymentMeta } from "../../lib/constants";

export default function RecentActivity({ expenses, collections, onSeeAll }) {
  const items = useMemo(() => {
    const e = expenses.map((r) => ({ kind: "expense", ...r }));
    const c = collections.map((r) => ({ kind: "collection", ...r }));
    return [...e, ...c]
      .sort((a, b) => {
        const d = new Date(b.date) - new Date(a.date);
        if (d !== 0) return d;
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      })
      .slice(0, 6);
  }, [expenses, collections]);

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-cream-100">
          <History className="h-4 w-4 text-gold-300" aria-hidden="true" />
          Recent Activity
        </h2>
        {items.length > 0 && onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-medium text-saffron-300 transition hover:text-saffron-200"
          >
            View expenses
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={History}
          title="No activity yet"
          description="Expenses and collections will appear here as soon as they're added."
        />
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((it) => {
              const isExpense = it.kind === "expense";
              const meta = isExpense ? categoryMeta(it.category) : paymentMeta(it.payment_method);
              return (
                <RecordRow
                  key={`${it.kind}-${it.id}`}
                  icon={isExpense ? meta.icon || ReceiptText : meta.icon || HandCoins}
                  iconTone={
                    isExpense
                      ? "text-saffron-300 bg-saffron-500/15"
                      : "text-emerald-300 bg-emerald-500/15"
                  }
                  title={isExpense ? it.name : it.contributor_name}
                  tags={[isExpense ? "Expense" : "Collection", meta.label]}
                  addedBy={it.added_by}
                  date={it.date}
                  amount={it.amount}
                  amountPrefix={isExpense ? "− " : "+ "}
                  amountTone={isExpense ? "text-saffron-200" : "text-emerald-200"}
                />
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
