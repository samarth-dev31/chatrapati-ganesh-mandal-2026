import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * `true` only when both public env vars are present. Until the Supabase
 * project + migration are ready, the app runs on sample data and this stays
 * `false`, letting the UI degrade gracefully instead of crashing.
 */
export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// The authorised editor account emails. The password-only login screen tries
// the typed password against each of these via Supabase Auth until one signs
// in, so editors never enter an email in the UI. This list is not a security
// boundary — RLS gates every write against public.editors, and each editor
// must also exist as a Supabase Auth user.
export const EDITOR_EMAILS = (import.meta.env.VITE_EDITOR_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
