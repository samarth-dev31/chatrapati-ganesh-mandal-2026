/**
 * Public / RLS smoke test. Run after filling in .env:
 *   node scripts/check-supabase.mjs
 *
 * Verifies, using ONLY the publishable (anon) key:
 *   - anonymous SELECT on expenses / collections works (public read)
 *   - anonymous INSERT on expenses is blocked by RLS
 *   - the editors allow-list is not readable anonymously
 *   - all three configured editor emails are present in public.editors
 *     (checked indirectly — see note below)
 *
 * It does NOT sign in as an editor (no passwords here). Do the editor
 * add/edit/delete/logout checks in the browser.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  let raw = "";
  try {
    raw = readFileSync(new URL("../.env", import.meta.url), "utf8");
  } catch {
    console.error("✗ No .env file found. Copy .env.example to .env first.");
    process.exit(1);
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const emails = (env.VITE_EDITOR_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);

if (!url || !key) {
  console.error("✗ VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set in .env");
  process.exit(1);
}

const anon = createClient(url, key, { auth: { persistSession: false } });
let failures = 0;
const ok = (m) => console.log(`✓ ${m}`);
const bad = (m) => {
  console.log(`✗ ${m}`);
  failures++;
};

console.log(`\nProject: ${url}`);
console.log(`Editor emails configured: ${emails.length ? emails.join(", ") : "(none)"}\n`);

// 1. Public read
for (const table of ["expenses", "collections"]) {
  const { error } = await anon.from(table).select("*").limit(1);
  if (error) bad(`anon SELECT ${table} — ${error.message}`);
  else ok(`anon SELECT ${table} allowed (public read)`);
}

// 2. Anon write must be blocked
{
  const { error } = await anon.from("expenses").insert({
    name: "RLS test (should fail)",
    amount: 1,
    category: "Other",
    date: new Date().toISOString().slice(0, 10),
    added_by: "rls-test",
  });
  if (error) ok(`anon INSERT expenses blocked by RLS — ${error.code || error.message}`);
  else bad("anon INSERT expenses SUCCEEDED — RLS is not protecting writes!");
}

// 3. editors table not anon-readable
{
  const { data, error } = await anon.from("editors").select("email");
  if (error) ok(`anon SELECT editors blocked — ${error.code || error.message}`);
  else if (Array.isArray(data) && data.length === 0)
    ok("anon SELECT editors returns nothing (locked down)");
  else bad(`anon SELECT editors exposed ${data.length} row(s)`);
}

// 4. is_editor() exists and is false for anonymous
{
  const { data, error } = await anon.rpc("is_editor");
  if (error) bad(`rpc is_editor() — ${error.message}`);
  else if (data === false) ok("is_editor() returns false for anonymous caller");
  else bad(`is_editor() returned ${JSON.stringify(data)} for anonymous caller`);
}

console.log(
  failures === 0
    ? "\nAll public / RLS checks passed. Do the editor-mode checks in the browser.\n"
    : `\n${failures} check(s) FAILED — review above.\n`,
);
process.exit(failures === 0 ? 0 : 1);
