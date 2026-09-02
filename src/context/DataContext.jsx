import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const DataContext = createContext(null);

const NOT_CONFIGURED =
  "Supabase isn't configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.";

function sortByDateDesc(rows) {
  return [...rows].sort((a, b) => {
    const d = new Date(b.date) - new Date(a.date);
    if (d !== 0) return d;
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
}

export function DataProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError(NOT_CONFIGURED);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [exp, col] = await Promise.all([
        supabase
          .from("expenses")
          .select("*")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase
          .from("collections")
          .select("*")
          .order("date", { ascending: false })
          .order("created_at", { ascending: false }),
      ]);
      if (exp.error) throw exp.error;
      if (col.error) throw col.error;
      setExpenses(exp.data || []);
      setCollections(col.data || []);
    } catch (err) {
      setError(err.message || "Could not load data. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // --- Mutations ---------------------------------------------------------
  // Each returns { data?, error }. RLS enforces that only signed-in editors
  // can write; a policy violation surfaces here as a friendly error string.

  const addRow = useCallback(async (table, setRows, payload) => {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
    const { data, error } = await supabase.from(table).insert(payload).select().single();
    if (error) return { data: null, error: friendlyWriteError(error) };
    setRows((rows) => sortByDateDesc([data, ...rows]));
    return { data, error: null };
  }, []);

  const updateRow = useCallback(async (table, setRows, id, patch) => {
    if (!isSupabaseConfigured) return { data: null, error: NOT_CONFIGURED };
    const { data, error } = await supabase.from(table).update(patch).eq("id", id).select().single();
    if (error) return { data: null, error: friendlyWriteError(error) };
    setRows((rows) => sortByDateDesc(rows.map((r) => (r.id === id ? data : r))));
    return { data, error: null };
  }, []);

  const deleteRow = useCallback(async (table, setRows, id) => {
    if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return { error: friendlyWriteError(error) };
    setRows((rows) => rows.filter((r) => r.id !== id));
    return { error: null };
  }, []);

  const api = useMemo(() => {
    const totals = {
      collection: collections.reduce((s, r) => s + Number(r.amount || 0), 0),
      expenses: expenses.reduce((s, r) => s + Number(r.amount || 0), 0),
    };
    totals.balance = totals.collection - totals.expenses;

    return {
      expenses,
      collections,
      loading,
      error,
      totals,
      refresh: load,
      addExpense: (p) => addRow("expenses", setExpenses, p),
      updateExpense: (id, p) => updateRow("expenses", setExpenses, id, p),
      deleteExpense: (id) => deleteRow("expenses", setExpenses, id),
      addCollection: (p) => addRow("collections", setCollections, p),
      updateCollection: (id, p) => updateRow("collections", setCollections, id, p),
      deleteCollection: (id) => deleteRow("collections", setCollections, id),
    };
  }, [expenses, collections, loading, error, load, addRow, updateRow, deleteRow]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

function friendlyWriteError(error) {
  const msg = error?.message || "";
  if (error?.code === "42501" || /row-level security|permission denied/i.test(msg)) {
    return "You're not signed in as an editor, or your session expired. Enter editor mode and try again.";
  }
  return msg || "Something went wrong saving. Try again.";
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
