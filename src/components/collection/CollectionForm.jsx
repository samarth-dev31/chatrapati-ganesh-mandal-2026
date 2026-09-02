import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, TextInput, TextArea, AmountInput, DateInput, OptionGrid } from "../ui/Field";
import { PAYMENT_METHODS } from "../../lib/constants";
import { validateCollection } from "../../lib/validation";
import { todayISO } from "../../lib/format";
import { useToast } from "../../context/ToastContext";

const empty = {
  contributor_name: "",
  amount: "",
  payment_method: "Cash",
  date: todayISO(),
  added_by: "",
  note: "",
};

export default function CollectionForm({ open, onClose, initial, onSubmit }) {
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
            contributor_name: initial.contributor_name ?? "",
            amount: String(initial.amount ?? ""),
            payment_method: initial.payment_method ?? "Cash",
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
    const found = validateCollection(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSaving(true);
    const payload = {
      contributor_name: values.contributor_name.trim(),
      amount: Number(values.amount),
      payment_method: values.payment_method,
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
    toast.success(isEdit ? "Collection updated." : "Collection added.");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={saving ? undefined : onClose}
      title={isEdit ? "Edit collection" : "Add collection"}
      description={isEdit ? "Update the details below." : "Record a contribution received."}
      footer={
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="collection-form" className="flex-1" loading={saving}>
            {isEdit ? "Save changes" : "Add collection"}
          </Button>
        </div>
      }
    >
      <form id="collection-form" onSubmit={handleSubmit} className="space-y-4 pb-2" noValidate>
        <Field label="Contributor name" htmlFor="col-name" error={errors.contributor_name} required>
          <TextInput
            id="col-name"
            value={values.contributor_name}
            onChange={set("contributor_name")}
            placeholder="e.g. Ramesh Deshmukh"
            error={errors.contributor_name}
            autoComplete="off"
            maxLength={120}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount" htmlFor="col-amount" error={errors.amount} required>
            <AmountInput
              id="col-amount"
              value={values.amount}
              onChange={set("amount")}
              placeholder="0"
              error={errors.amount}
            />
          </Field>
          <Field label="Date" htmlFor="col-date" error={errors.date} required>
            <DateInput id="col-date" value={values.date} onChange={set("date")} max={todayISO()} error={errors.date} />
          </Field>
        </div>

        <Field label="Payment method" error={errors.payment_method} required>
          <OptionGrid
            options={PAYMENT_METHODS}
            value={values.payment_method}
            onChange={set("payment_method")}
            label="Payment method"
          />
        </Field>

        <Field label="Added by" htmlFor="col-by" error={errors.added_by} required>
          <TextInput
            id="col-by"
            value={values.added_by}
            onChange={set("added_by")}
            placeholder="Your name"
            error={errors.added_by}
            autoComplete="name"
            maxLength={80}
          />
        </Field>

        <Field label="Note" htmlFor="col-note" hint="Optional — any extra detail.">
          <TextArea
            id="col-note"
            value={values.note}
            onChange={set("note")}
            placeholder="e.g. Collected during door-to-door drive"
            maxLength={300}
          />
        </Field>
      </form>
    </Modal>
  );
}
