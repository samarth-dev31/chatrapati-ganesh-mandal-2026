# Chatrapati Ganesh Mandal, Wadwani — Expense & Collection Tracker

गणेशोत्सव २०२६ · गणपती बाप्पा मोरया 🙏

A mobile-first web app to track the mandal's Ganeshotsav collections and
expenses. Anyone can open it and view the accounts; only authorised editors can
add, edit or delete records.

## Tech

React + Vite · Tailwind CSS · Lucide icons · Framer Motion · Supabase
(Auth + Postgres + Row Level Security).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

Without Supabase keys the app runs in **preview mode** with sample data so the
UI is fully usable. Add the keys to switch to live data.

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable / anon key (safe in the browser) |
| `VITE_EDITOR_EMAILS` | Comma-separated list of the authorised editor account emails — the password-only login tries the typed password against each in turn |

The service-role / secret key is **never** used in the frontend.

## Database

Two files in `supabase/migrations/`, run manually in the Supabase SQL Editor,
in order. Both are safe to re-run.

1. `0001_init.sql` — pure DDL: tables, `is_editor()`, RLS policies, grants,
   indexes.
2. `0002_seed_editors.sql` — allow-lists the three committee editor emails in
   `public.editors`.

Then:

1. **Authentication → Users → Add user** — create each of the three editor
   accounts with its own strong password. The app never asks for the email;
   each editor just types their password.
2. Put the same three emails in `VITE_EDITOR_EMAILS` (comma-separated).
3. Optionally disable email signups in Auth settings.

## How permissions work

- **Public visitors** — read-only. RLS allows `SELECT` on `expenses` and
  `collections` for everyone.
- **Editors** — three separate Supabase Auth accounts. Sign in on the
  *More → Editor Mode* screen with a password only; the app pairs it with each
  configured editor email until one authenticates. `INSERT / UPDATE / DELETE`
  are allowed by RLS only when the authenticated user's email is in
  `public.editors` (checked by `public.is_editor()`).

Editor-only buttons are hidden from visitors, and RLS is the real enforcement —
the UI cannot be used to bypass it.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |

## Project structure

```
src/
  context/     Auth, Data (CRUD + totals), Toast providers
  components/
    layout/    Bottom nav, desktop sidebar, page header
    ui/        Button, Card, Modal, Field inputs, Toast, EmptyState…
    dashboard/ Brand header, summary cards, recent activity
    expenses/  Expense form
    collection/Collection form
    shared/    RecordRow, TotalStrip
  pages/       Home, Expenses, Collection, More
  lib/         supabaseClient, constants, format, validation, sampleData
supabase/
  migrations/  0001_init.sql · 0002_seed_editors.sql
```
