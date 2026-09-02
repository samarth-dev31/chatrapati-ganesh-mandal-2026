// Indian-style currency + date formatting helpers.

const inr = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const inrPaise = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a number as ₹ 1,23,456 (no decimals unless the value has paise). */
export function formatCurrency(value) {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  const hasPaise = Math.round(abs * 100) % 100 !== 0;
  const body = hasPaise ? inrPaise.format(abs) : inr.format(abs);
  return `${n < 0 ? "-" : ""}₹${body}`;
}

/** Plain grouped number without the symbol. */
export function formatNumber(value) {
  return inr.format(Number(value) || 0);
}

/** "12 Aug 2026" */
export function formatDate(value) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Relative-ish label: Today / Yesterday / 12 Aug 2026 */
export function formatDateFriendly(value) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(d)) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return formatDate(d);
}

/** yyyy-mm-dd for <input type="date"> defaults. */
export function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/** Initials for an avatar chip. */
export function initials(name) {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "?";
}
