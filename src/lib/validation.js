import { EXPENSE_CATEGORY_VALUES, PAYMENT_METHOD_VALUES } from "./constants";

const MAX_AMOUNT = 10_000_000; // ₹1 crore guard rail

function amountError(raw) {
  if (raw === "" || raw === null || raw === undefined) return "Enter an amount.";
  const n = Number(raw);
  if (Number.isNaN(n)) return "Amount must be a number.";
  if (n < 0) return "Amount cannot be negative.";
  if (n === 0) return "Amount must be greater than zero.";
  if (n > MAX_AMOUNT) return "That amount looks too large.";
  return null;
}

function required(value, label) {
  return String(value ?? "").trim() ? null : `${label} is required.`;
}

function validDate(value) {
  if (!value) return "Pick a date.";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "That date is not valid.";
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  if (d.getTime() > now.getTime() + 86400000) return "Date can't be in the future.";
  return null;
}

/** Returns an object of field -> message. Empty object means valid. */
export function validateExpense(values) {
  const errors = {};
  const nameErr = required(values.name, "Expense name");
  if (nameErr) errors.name = nameErr;

  const amtErr = amountError(values.amount);
  if (amtErr) errors.amount = amtErr;

  if (!EXPENSE_CATEGORY_VALUES.includes(values.category)) {
    errors.category = "Choose a category.";
  }

  const dateErr = validDate(values.date);
  if (dateErr) errors.date = dateErr;

  const byErr = required(values.added_by, "Added by");
  if (byErr) errors.added_by = byErr;

  return errors;
}

export function validateCollection(values) {
  const errors = {};
  const nameErr = required(values.contributor_name, "Contributor name");
  if (nameErr) errors.contributor_name = nameErr;

  const amtErr = amountError(values.amount);
  if (amtErr) errors.amount = amtErr;

  if (!PAYMENT_METHOD_VALUES.includes(values.payment_method)) {
    errors.payment_method = "Choose a payment method.";
  }

  const dateErr = validDate(values.date);
  if (dateErr) errors.date = dateErr;

  const byErr = required(values.added_by, "Added by");
  if (byErr) errors.added_by = byErr;

  return errors;
}
