import {
  Sparkles,
  Speaker,
  Lightbulb,
  UtensilsCrossed,
  Flower2,
  CalendarHeart,
  Package,
  Truck,
  Shapes,
  Banknote,
  Smartphone,
  Landmark,
  Wallet,
} from "lucide-react";

// Expense categories — value is stored in DB, label is shown, icon for UI.
export const EXPENSE_CATEGORIES = [
  { value: "Decoration", label: "Decoration", icon: Sparkles },
  { value: "Sound", label: "Sound", icon: Speaker },
  { value: "Lighting", label: "Lighting", icon: Lightbulb },
  { value: "Food / Prasad", label: "Food / Prasad", icon: UtensilsCrossed },
  { value: "Flowers", label: "Flowers", icon: Flower2 },
  { value: "Events", label: "Events", icon: CalendarHeart },
  { value: "Materials", label: "Materials", icon: Package },
  { value: "Transport", label: "Transport", icon: Truck },
  { value: "Other", label: "Other", icon: Shapes },
];

export const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash", icon: Banknote },
  { value: "UPI", label: "UPI", icon: Smartphone },
  { value: "Bank Transfer", label: "Bank Transfer", icon: Landmark },
  { value: "Other", label: "Other", icon: Wallet },
];

export const EXPENSE_CATEGORY_VALUES = EXPENSE_CATEGORIES.map((c) => c.value);
export const PAYMENT_METHOD_VALUES = PAYMENT_METHODS.map((m) => m.value);

export function categoryMeta(value) {
  return (
    EXPENSE_CATEGORIES.find((c) => c.value === value) || {
      value,
      label: value || "Other",
      icon: Shapes,
    }
  );
}

export function paymentMeta(value) {
  return (
    PAYMENT_METHODS.find((m) => m.value === value) || {
      value,
      label: value || "Other",
      icon: Wallet,
    }
  );
}

export const APP_VERSION = "1.0.0";
export const MANDAL_NAME = "Chatrapati Ganesh Mandal, Wadwani";
export const FESTIVAL_LINE = "गणेशोत्सव २०२६";
export const GREETING = "गणपती बाप्पा मोरया 🙏";
