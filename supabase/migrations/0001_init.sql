-- ============================================================================
--  Chatrapati Ganesh Mandal, Wadwani — Ganeshotsav 2026
--  Expense & Collection Tracker — initial schema + Row Level Security
-- ----------------------------------------------------------------------------
--  REVIEW BEFORE RUNNING. Execute manually in the Supabase SQL Editor.
--  Pure DDL: schema, function, RLS policies, grants and indexes only.
--  Editor emails are seeded separately (see 0002_seed_editors.sql).
--  Safe to re-run: tables use IF NOT EXISTS, policies are dropped then
--  recreated, the function uses CREATE OR REPLACE.
-- ============================================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. TABLES
-- ----------------------------------------------------------------------------

-- Authorised editors. One row per editor email (store lowercase).
-- Managed only from the SQL editor / service role — no write policies below.
create table if not exists public.editors (
  email       text primary key,
  created_at  timestamptz not null default now()
);

comment on table public.editors is
  'Emails allowed to insert/update/delete expenses and collections. Checked by public.is_editor() and enforced by RLS.';

create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null check (char_length(btrim(name)) between 1 and 120),
  amount      numeric(12,2) not null check (amount >= 0),
  category    text        not null check (category in (
                'Decoration','Sound','Lighting','Food / Prasad','Flowers',
                'Events','Materials','Transport','Other')),
  date        date        not null,
  added_by    text        not null check (char_length(btrim(added_by)) between 1 and 80),
  note        text        check (note is null or char_length(note) <= 300),
  created_at  timestamptz not null default now()
);

create table if not exists public.collections (
  id                uuid primary key default gen_random_uuid(),
  contributor_name  text        not null check (char_length(btrim(contributor_name)) between 1 and 120),
  amount            numeric(12,2) not null check (amount >= 0),
  payment_method    text        not null check (payment_method in (
                      'Cash','UPI','Bank Transfer','Other')),
  date              date        not null,
  added_by          text        not null check (char_length(btrim(added_by)) between 1 and 80),
  note              text        check (note is null or char_length(note) <= 300),
  created_at        timestamptz not null default now()
);

-- Helpful ordering indexes (newest first).
create index if not exists expenses_date_idx    on public.expenses    (date desc, created_at desc);
create index if not exists collections_date_idx on public.collections (date desc, created_at desc);

-- ----------------------------------------------------------------------------
-- 2. EDITOR CHECK HELPER
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER so it can read public.editors regardless of the caller's
-- RLS. Returns true when the current authenticated user's email is listed.

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.editors e
    where lower(e.email) = lower(nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', ''))
  );
$$;

comment on function public.is_editor() is
  'True when the current authenticated user is listed in public.editors.';

-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------

alter table public.editors     enable row level security;
alter table public.expenses    enable row level security;
alter table public.collections enable row level security;

-- --- editors --------------------------------------------------------------
-- An authenticated user may read only their own row (used by the app to
-- confirm editor status). No insert/update/delete policies => locked down.
drop policy if exists "editors_select_self" on public.editors;
create policy "editors_select_self"
  on public.editors
  for select
  to authenticated
  using (
    lower(email) = lower(nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'email', ''))
  );

-- --- expenses -----------------------------------------------------------
drop policy if exists "expenses_select_public" on public.expenses;
create policy "expenses_select_public"
  on public.expenses
  for select
  to anon, authenticated
  using (true);

drop policy if exists "expenses_insert_editor" on public.expenses;
create policy "expenses_insert_editor"
  on public.expenses
  for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists "expenses_update_editor" on public.expenses;
create policy "expenses_update_editor"
  on public.expenses
  for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "expenses_delete_editor" on public.expenses;
create policy "expenses_delete_editor"
  on public.expenses
  for delete
  to authenticated
  using (public.is_editor());

-- --- collections ------------------------------------------------------
drop policy if exists "collections_select_public" on public.collections;
create policy "collections_select_public"
  on public.collections
  for select
  to anon, authenticated
  using (true);

drop policy if exists "collections_insert_editor" on public.collections;
create policy "collections_insert_editor"
  on public.collections
  for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists "collections_update_editor" on public.collections;
create policy "collections_update_editor"
  on public.collections
  for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists "collections_delete_editor" on public.collections;
create policy "collections_delete_editor"
  on public.collections
  for delete
  to authenticated
  using (public.is_editor());

-- ----------------------------------------------------------------------------
-- 4. GRANTS
-- ----------------------------------------------------------------------------
-- RLS still applies on top of these table-level privileges.

grant usage on schema public to anon, authenticated;

grant select                         on public.expenses    to anon, authenticated;
grant select                         on public.collections to anon, authenticated;
grant insert, update, delete         on public.expenses    to authenticated;
grant insert, update, delete         on public.collections to authenticated;
grant select                         on public.editors     to authenticated;

grant execute on function public.is_editor() to anon, authenticated;

-- ============================================================================
-- NEXT STEPS (done outside this file)
-- ----------------------------------------------------------------------------
--   1. Run 0002_seed_editors.sql to allow-list the three editor emails.
--   2. Authentication > Users > "Add user": create each of the three editor
--      accounts with its own strong password. The app never asks for an email.
--   3. Set VITE_EDITOR_EMAILS in .env to the same three emails (comma-separated).
--   4. (Optional) turn off "Enable email signups" in Auth settings.
-- ============================================================================
