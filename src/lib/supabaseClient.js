import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const rawKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "").trim();

/**
 * A usable Supabase URL must be a full http(s) URL — not empty, not a
 * placeholder, not a bare `xxx.supabase.co` host. `createClient` throws
 * synchronously on anything else, so we check first.
 */
function isValidHttpUrl(value) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

let client = null;
let configured = false;

if (isValidHttpUrl(rawUrl) && rawKey) {
  try {
    client = createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
    configured = true;
  } catch (err) {
    // Malformed credentials — degrade to the "not connected" state instead of
    // crashing the whole app at load (which would blank the screen).
    console.error("Supabase client init failed; running unconfigured.", err);
  }
} else if (rawUrl || rawKey) {
  console.warn(
    "Supabase env vars are set but invalid — VITE_SUPABASE_URL must be a full " +
      "https URL (e.g. https://xxxx.supabase.co). Running unconfigured.",
  );
}

/**
 * `true` only when both public env vars are present, valid, and the client
 * initialised. Until then the app runs read-only/unconnected and the UI shows
 * a "backend not connected" state instead of a blank screen.
 */
export const isSupabaseConfigured = configured;

export const supabase = client;

// The authorised editor account emails. The password-only login screen tries
// the typed password against each of these via Supabase Auth until one signs
// in, so editors never enter an email in the UI. This list is not a security
// boundary — RLS gates every write against public.editors, and each editor
// must also exist as a Supabase Auth user.
export const EDITOR_EMAILS = (import.meta.env.VITE_EDITOR_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
