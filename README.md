# Chatrapati Ganesh Mandal, Wadwani — Expense & Collection Tracker

गणेशोत्सव २०२६ · गणपती बाप्पा मोरया 🙏

A mobile-first web app to track the mandal's Ganeshotsav collections and
expenses. Anyone can open it and view the accounts; only authorised editors can
add, edit or delete records.

## Tech

React 19 + Vite · Tailwind CSS · Lucide icons · Framer Motion · Supabase
(Auth + Postgres + Row Level Security).

---

## Quick start (local)

Prerequisites: **Node 18+** and a **Supabase project** (free tier is fine).

```bash
git clone https://github.com/samarth-dev31/chatrapati-ganesh-mandal-2026.git
cd chatrapati-ganesh-mandal-2026
npm install
cp .env.example .env      # fill in the values — see "Environment" below
npm run dev               # http://localhost:5173
```

The app needs the Supabase keys to load any data. Without them it starts but
every screen shows a "backend not connected" state.

---

## Setup from scratch

### 1. Create the Supabase project

1. Go to <https://supabase.com/dashboard>, create a new project, pick a region
   close to your users, and set a database password (you won't need it in the
   app).
2. When it finishes provisioning, open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Publishable / anon key** (the `sb_publishable_…` or `anon` `public` key)
     → `VITE_SUPABASE_PUBLISHABLE_KEY`

> Never copy the **service_role** / secret key into this project. It is not used
> anywhere in the frontend and must never reach the browser.

### 2. Run the database migrations

Open **SQL Editor** in the Supabase dashboard and run these files from
`supabase/migrations/`, **in order**. All three are idempotent (safe to re-run).

| File | What it does |
| --- | --- |
| `0001_init.sql` | Tables (`expenses`, `collections`, `editors`), the `is_editor()` helper, RLS policies, grants, indexes. |
| `0002_seed_editors.sql` | Allow-lists the editor emails in `public.editors`. **Edit the placeholder emails to your real committee emails before running.** |
| `0003_value_checks.sql` | Adds `CHECK` constraints (valid category / payment method / amount / lengths) as defence in depth. Run while the tables are empty. |

### 3. Create the editor accounts

For each committee editor:

1. **Authentication → Users → Add user** — set an email (must match one of the
   emails you put in `0002_seed_editors.sql`) and a strong password.
2. Mark the user as **auto-confirmed** so they can sign in immediately.

The app never asks anyone for an email — each editor just types their password
on the **More → Editor Mode** screen, and the app tries it against each
configured editor email until one signs in.

Optionally, in **Authentication → Providers → Email**, turn **off** "Enable
signups" so no new accounts can be self-created.

### 4. Fill in `.env`

```bash
cp .env.example .env
```

```dotenv
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxx
VITE_EDITOR_EMAILS=editor-one@example.com,editor-two@example.com,editor-three@example.com
```

`.env` is git-ignored — never commit it. Only `.env.example` (placeholders) is
tracked.

### 5. Verify the connection

```bash
npm run check:supabase
```

This uses only the publishable key and checks that public reads work, anon
writes are blocked by RLS, and the `editors` table is locked down.

---

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable / anon key (safe in the browser; RLS enforces all permissions) |
| `VITE_EDITOR_EMAILS` | Comma-separated list of the authorised editor account emails — the password-only login tries the typed password against each in turn. Not a security boundary; RLS is. |

---

## How permissions work

- **Public visitors** — read-only, no login. RLS allows `SELECT` on `expenses`
  and `collections` for everyone.
- **Editors** — separate Supabase Auth accounts. Sign in on **More → Editor
  Mode** with a password only. `INSERT / UPDATE / DELETE` are allowed by RLS
  only when the authenticated user's email is in `public.editors` (checked by
  `public.is_editor()`).

Editor-only buttons are hidden from visitors, and RLS is the real enforcement —
the UI cannot be used to bypass it. The dashboard's Total Collection, Total
Expenses and Current Balance are always computed live from the rows, never
stored.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint with oxlint |
| `npm run check:supabase` | Public / RLS smoke test against the configured project |

---

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** set `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_EDITOR_EMAILS` in the host's
  dashboard (same values as your `.env`). They are baked into the bundle at
  build time, so redeploy after changing them.

No server or serverless function is required — the app talks to Supabase
directly from the browser, and RLS keeps it safe.

---

## Project structure

```
src/
  context/     Auth, Data (CRUD + live totals), Toast providers
  components/
    layout/    Bottom nav, desktop sidebar, page header
    ui/        Button, Card, Modal, Field inputs, Toast, EmptyState…
    dashboard/ Brand header, summary cards, recent activity
    expenses/  Expense form
    collection/ Collection form
    shared/    RecordRow, TotalStrip
  pages/       Home, Expenses, Collection, More
  lib/         supabaseClient, constants, format, validation
supabase/
  migrations/  0001_init.sql · 0002_seed_editors.sql · 0003_value_checks.sql
scripts/
  check-supabase.mjs   Public / RLS smoke test
```
