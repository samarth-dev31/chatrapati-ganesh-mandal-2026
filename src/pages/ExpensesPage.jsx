import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, ReceiptText, TrendingDown } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import TotalStrip from "../components/shared/TotalStrip";
import RecordRow from "../components/shared/RecordRow";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Banner from "../components/ui/Banner";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ExpenseForm from "../components/expenses/ExpenseForm";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { categoryMeta } from "../lib/constants";

export default function ExpensesPage() {
  const { expenses, totals, loading, error, refresh, addExpense, updateExpense, deleteExpense } = useData();
  const { isEditor } = useAuth();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    const { error: err } = await deleteExpense(pendingDelete.id);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Expense deleted.");
    setPendingDelete(null);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Expenses"
        subtitle="Money spent by the mandal"
        action={
          isEditor && (
            <Button size="sm" onClick={openAdd} className="shrink-0">
              <Plus className="h-4 w-4" /> Add
            </Button>
          )
        }
      />

      <TotalStrip
        label="Total Expenses"
        value={totals.expenses}
        icon={TrendingDown}
        tone="saffron"
        count={expenses.length}
      />

      {error && (
        <div className="mt-4">
          <Banner tone="error" title="Couldn't load expenses" onRetry={refresh}>
            {error}
          </Banner>
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <Spinner label="Loading expenses…" />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={ReceiptText}
            title="No expenses recorded yet"
            description={
              isEditor
                ? "Add the first expense to start tracking the mandal's spending."
                : "Once the committee records spending, it will show up here."
            }
            action={
              isEditor && (
                <Button onClick={openAdd}>
                  <Plus className="h-4 w-4" /> Add expense
                </Button>
              )
            }
          />
        ) : (
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {expenses.map((row) => {
                const meta = categoryMeta(row.category);
                return (
                  <RecordRow
                    key={row.id}
                    icon={meta.icon}
                    iconTone="text-saffron-300 bg-saffron-500/15"
                    title={row.name}
                    tags={[meta.label]}
                    note={row.note}
                    addedBy={row.added_by}
                    date={row.date}
                    amount={row.amount}
                    amountPrefix="− "
                    amountTone="text-saffron-200"
                    editable={isEditor}
                    onEdit={() => openEdit(row)}
                    onDelete={() => setPendingDelete(row)}
                  />
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {isEditor && (
        <ExpenseForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          onSubmit={(payload) =>
            editing ? updateExpense(editing.id, payload) : addExpense(payload)
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Delete this expense?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
