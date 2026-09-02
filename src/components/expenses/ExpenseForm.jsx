import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, TextInput, TextArea, AmountInput, DateInput, OptionGrid } from "../ui/Field";
import { EXPENSE_CATEGORIES } from "../../lib/constants";
import { validateExpense } from "../../lib/validation";
import { todayISO } from "../../lib/format";
import { useToast } from "../../context/ToastContext";

const empty = {
  name: "",
  amount: "",
  category: "Decoration",
  date: todayISO(),
  added_by: "",
  note: "",
};

export default function ExpenseForm({ open, onClose, initial, onSubmit }) {
  const isEdit = Boolean(initial);
  const toast = useToast();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      initial
        ? {
            name: initial.name ?? "",
            amount: String(initial.amount ?? ""),
            category: initial.category ?? "Decoration",
            date: initial.date ?? todayISO(),
            added_by: initial.added_by ?? "",
            note: initial.note ?? "",
          }
        : empty,
    );
  }, [open, initial]);

  const set = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateExpense(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSaving(true);
    const payload = {
      name: values.name.trim(),
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
      added_by: values.added_by.trim(),
      note: values.note.trim() || null,
    };
    const { error } = await onSubmit(payload);
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(isEdit ? "Expense updated." : "Expense added.");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      title={isEdit ? "Edit expense" : "Add expense"}
      description={isEdit ? "Update the details below." : "Record money spent by the mandal."}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="expense-form" className="flex-1" loading={saving}>
            {isEdit ? "Save changes" : "Add expense"}
          </Button>
        </div>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit} className="space-y-4 pb-2" noValidate>
        <Field label="Expense name" htmlFor="exp-name" error={errors.name} required>
          <TextInput
            id="exp-name"
            value={values.name}
            onChange={set("name")}
            placeholder="e.g. Stage decoration"
            error={errors.name}
            autoComplete="off"
            maxLength={120}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" htmlFor="exp-amount" error={errors.amount} required>
            <AmountInput
              id="exp-amount"
              value={values.amount}
              onChange={set("amount")}
              placeholder="0"
              error={errors.amount}
            />
          </Field>
          <Field label="Date" htmlFor="exp-date" error={errors.date} required>
            <DateInput id="exp-date" value={values.date} onChange={set("date")} max={todayISO()} error={errors.date} />
          </Field>
        </div>

        <Field label="Category" error={errors.category} required>
          <OptionGrid
            options={EXPENSE_CATEGORIES}
            value={values.category}
            onChange={set("category")}
            label="Category"
          />
        </Field>

        <Field label="Added by" htmlFor="exp-by" error={errors.added_by} required>
          <TextInput
            id="exp-by"
            value={values.added_by}
            onChange={set("added_by")}
            placeholder="Your name"
            error={errors.added_by}
            autoComplete="name"
            maxLength={80}
          />
        </Field>

        <Field label="Note" htmlFor="exp-note" hint="Optional — any extra detail.">
          <TextArea
            id="exp-note"
            value={values.note}
            onChange={set("note")}
            placeholder="e.g. Advance paid, balance pending"
            maxLength={300}
          />
        </Field>
      </form>
    </Modal>
  );
}
