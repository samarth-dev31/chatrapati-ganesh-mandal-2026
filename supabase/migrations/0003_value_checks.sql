-- ============================================================================
--  Chatrapati Ganesh Mandal, Wadwani — value / domain CHECK constraints
-- ----------------------------------------------------------------------------
--  Run manually in the Supabase SQL Editor, AFTER 0001 and 0002.
--
--  WHY THIS FILE EXISTS
--  --------------------
--  0001_init.sql creates public.expenses / public.collections with
--  `create table if not exists` and defines category / payment_method /
--  amount / length CHECK constraints inline. If those two tables already
--  existed (created by an earlier schema), `if not exists` is a silent
--  no-op and the CHECK constraints are never applied — so the database
--  will accept e.g. category = 'Nonsense' or payment_method = 'Bitcoin'.
--
--  The React app validates every value on the client (src/lib/validation.js
--  + the fixed OptionGrid choices), so bad values cannot come from the UI.
--  This migration adds the same guards at the database level as defence in
--  depth. It is safe to run when the tables are empty; if they contain rows
--  that violate a constraint, that ADD CONSTRAINT will fail — clean the data
--  first.
--
--  Idempotent: each constraint is dropped (if present) then re-added.
-- ============================================================================

-- --- expenses --------------------------------------------------------------
alter table public.expenses drop constraint if exists expenses_name_len_chk;
alter table public.expenses add  constraint expenses_name_len_chk
  check (char_length(btrim(name)) between 1 and 120);

alter table public.expenses drop constraint if exists expenses_amount_chk;
alter table public.expenses add  constraint expenses_amount_chk
  check (amount >= 0);

alter table public.expenses drop constraint if exists expenses_category_chk;
alter table public.expenses add  constraint expenses_category_chk
  check (category in (
    'Decoration','Sound','Lighting','Food / Prasad','Flowers',
    'Events','Materials','Transport','Other'));

alter table public.expenses drop constraint if exists expenses_added_by_len_chk;
alter table public.expenses add  constraint expenses_added_by_len_chk
  check (char_length(btrim(added_by)) between 1 and 80);

alter table public.expenses drop constraint if exists expenses_note_len_chk;
alter table public.expenses add  constraint expenses_note_len_chk
  check (note is null or char_length(note) <= 300);

-- --- collections ---------------------------------------------------------
alter table public.collections drop constraint if exists collections_name_len_chk;
alter table public.collections add  constraint collections_name_len_chk
  check (char_length(btrim(contributor_name)) between 1 and 120);

alter table public.collections drop constraint if exists collections_amount_chk;
alter table public.collections add  constraint collections_amount_chk
  check (amount >= 0);

alter table public.collections drop constraint if exists collections_payment_method_chk;
alter table public.collections add  constraint collections_payment_method_chk
  check (payment_method in ('Cash','UPI','Bank Transfer','Other'));

alter table public.collections drop constraint if exists collections_added_by_len_chk;
alter table public.collections add  constraint collections_added_by_len_chk
  check (char_length(btrim(added_by)) between 1 and 80);

alter table public.collections drop constraint if exists collections_note_len_chk;
alter table public.collections add  constraint collections_note_len_chk
  check (note is null or char_length(note) <= 300);

-- Verify:
--   select conrelid::regclass as table, conname, pg_get_constraintdef(oid)
--   from pg_constraint
--   where conrelid in ('public.expenses'::regclass, 'public.collections'::regclass)
--     and contype = 'c'
--   order by 1, 2;
