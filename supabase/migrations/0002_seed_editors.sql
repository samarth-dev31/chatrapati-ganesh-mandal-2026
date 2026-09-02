-- ============================================================================
--  Chatrapati Ganesh Mandal, Wadwani — Editor allow-list seed
-- ----------------------------------------------------------------------------
--  Run AFTER 0001_init.sql, and manually in the Supabase SQL Editor.
--  Idempotent — safe to re-run (ON CONFLICT DO NOTHING).
--
--  Replace the placeholder addresses below with your real committee editor
--  emails before running this file. Each email must ALSO exist as a Supabase
--  Auth user (Authentication > Users > "Add user", each with its own password)
--  and be listed in VITE_EDITOR_EMAILS for the password-only login flow. Being
--  in this table alone grants nothing without a valid Auth sign-in.
-- ============================================================================

insert into public.editors (email) values
  ('editor-one@example.com'),
  ('editor-two@example.com'),
  ('editor-three@example.com')
on conflict (email) do nothing;

-- Verify:
--   select email, created_at from public.editors order by email;

-- To revoke an editor later:
--   delete from public.editors where email = 'someone@example.com';
--   (also delete or disable their user under Authentication > Users)
