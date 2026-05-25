# CLAUDE.md — Nanu Marketing Hub

Internal marketing operations dashboard for Nanu (Unknown Systems Ltd). Single-page Next.js app backed by Supabase. Team-only tool, no public access.

## Stack

- **Next.js 14** (App Router) + **React 18**, JavaScript (not TypeScript for the main component — see gotchas)
- **Supabase** (Postgres) as the only backend/database
- **lucide-react** for icons
- Deployed on **Vercel** (auto-deploys on push to `main`)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # use this to verify changes compile before pushing
```

Login: `nicholas` / `1234` (PINs are seeded per-user in the `users` table).

Requires `.env.local` (copy from `.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://fffetwwlkxwzgaynnknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase → Project Settings → API>
```

## Architecture

```
app/
  layout.tsx        Root layout + metadata (favicon = public/favicon.svg)
  page.tsx          Renders <MarketingHub /> (client component)
  globals.css       ALL responsive CSS lives here (.nanu-* classes + media queries)
components/
  MarketingHub.jsx  ~3000-line single component = the ENTIRE app UI
lib/
  supabase.js       Supabase client (reads NEXT_PUBLIC_* env vars)
  db.js             Data layer: load + save/delete, snake_case <-> camelCase mapping
sql/
  01-schema.sql     Full table schema + RLS policies (run first in Supabase SQL Editor)
  02-seed.sql       Seed data (run after schema)
  03-notification-webhook.sql   Optional notification webhook/trigger notes
supabase/functions/ Edge Functions (email notifications — optional, see EMAIL-SETUP-GUIDE.md)
```

### Data flow

- On mount, `MarketingHub` calls `db.loadAllData()` — one `Promise.allSettled` over all tables, returns a single object with everything mapped to **camelCase**.
- Every mutation is an individual `db.saveX(obj)` / `db.deleteX(id)` that **upserts** to Supabase and maps back to **snake_case**.
- All db calls are wrapped in `run()` — they **never throw**, they log errors and return `{ error }`. UI stays responsive; check console for failures.
- Supabase has `"Allow all"` RLS policies + the anon key (internal tool, no per-user auth at the DB layer).

## Critical gotchas (these are the usual causes of breakage)

1. **`MarketingHub.jsx` is `.jsx`, NOT `.tsx`. Never put TypeScript syntax in it** — no type annotations (`: string`), no `as`, no `interface`/`type`, no generics on hooks (`useState<T>`). Any TS syntax breaks the build. Keep edits plain JS.
2. **Respect the Rules of Hooks.** All ~60 `useState`/`useEffect`/`useRef` calls live at the top of the component. Never add a `useState` inside a `switch`/`case`, conditional, loop, or nested render function.
3. **snake_case (DB) ↔ camelCase (app) mapping lives in `lib/db.js`.** When you add a column, you must update it in TWO places: the `.map(...)` inside `loadAllData()` AND the matching `saveX` upsert. Missing one means data silently doesn't load or doesn't persist (e.g. `due_date` ↔ `dueDate`, `contact_name` ↔ `contactName`).
4. **Brace balance after large edits.** A single missing/extra `}` in the 3000-line file is easy to introduce and hard to spot. After a big edit, run `npm run build` (or count braces) before assuming success.
5. **Responsive CSS goes in `app/globals.css`**, not inline. The `.nanu-*` class names there have matching media-query overrides at 1024 / 768 / 480px breakpoints.

## Database migrations

Supabase is the source of truth. Schema changes are applied **manually** in the Supabase Dashboard → SQL Editor. When a code change needs a schema change, also write the SQL into `sql/` and run it in Supabase. Do not assume migrations auto-apply.

## Email notifications (optional)

Resend + Supabase Edge Functions in `supabase/functions/`. Off by default; see `EMAIL-SETUP-GUIDE.md` for the full deploy/webhook/cron setup. Edge Functions are Deno/TypeScript and are unrelated to the Next.js build.

## Deploy

Push to `main` → Vercel builds and deploys automatically. Always run `npm run build` locally first.
