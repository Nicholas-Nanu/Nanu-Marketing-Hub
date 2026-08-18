# Nanu Team Hub — CLAUDE.md

This file contains everything Claude Code needs to know about the Nanu Team Hub project. Read this first before making any changes.

## Project Overview

Internal operations dashboard for **Nanu** (Unknown Systems Ltd) — a 5-person team across Marketing and Community Engagement. Single-page Next.js 14 app deployed to Vercel with Supabase as the backend.

**Live URLs:**
- App: deployed via Vercel from `Nicholas-Nanu/Nanu-Marketing-Hub` repo
- Database: `https://fffetwwlkxwzgaynnknu.supabase.co`

**Roles:** Admin, Executive, Marketing Lead, Content Creator, Designer, Social Media Manager. `isAdmin` gates the Admin panel; `isExec`/`canSeeBusiness` gate the Business section. Executive sees Business + all shared sections but NOT the Admin panel.

**Team accounts (PIN login):**
- nicholas / 1234 (Admin)
- holly / 2345
- sean / 3456
- alexander / 4567
- ed / 5678

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18
- **Database:** Supabase (PostgreSQL + JSONB) — anon key auth via env vars
- **Deployment:** Vercel
- **Components:** Single monolithic JSX file (`components/MarketingHub.jsx`) — ~3000 lines
- **Icons:** lucide-react
- **Styling:** Inline styles + globals.css for responsive media queries

## Critical Architecture Rules

### 1. File extension MUST be `.jsx` not `.tsx`
The main component is `components/MarketingHub.jsx`. **Never add TypeScript annotations** (`: any`, `: string`, etc.) to this file or its callers — they break the Vercel build silently. The `tsconfig.json` has `allowJs: true` for this reason.

### 2. tsconfig must exclude `supabase` folder
Edge Functions use Deno-style imports that fail Next.js compilation. Confirm `tsconfig.json` includes `"exclude": ["node_modules", "supabase"]`.

### 3. All DB calls wrapped in `run()` helper
Supabase returns PromiseLike (not standard Promise) which lacks `.catch()`. Every DB function in `lib/db.js` wraps the call:
```js
export const saveX = (x) => run(() => supabase.from('table').upsert(...));
```
Never call `supabase.from(...).upsert(...).catch(...)` directly — it crashes.

### 4. No useState inside switch cases
React hooks must be called at the top level. Adding `useState` inside a `case "section":` block triggers React error #310 (white screen crash). All state lives at the top of the component.

### 5. No backdrop click to close modals
The `<Modal>` component does NOT have a backdrop click handler. Modals can only be closed via the X button, Cancel button, or Done button. This prevents accidental data loss.

### 6. Use `doSave(fn)` for all save/delete actions
```js
<Btn onClick={()=>doSave(()=>{ ...save logic...; db.saveX(data) })}>Done</Btn>
```
`doSave` wraps in try/catch and always calls `closeM()` regardless of errors.

### 7. Form buttons must be INLINE JSX
Never wrap form actions in module-level components like `<FormActions>` — stale closures cause Save buttons to silently fail. Buttons must be written inline inside each modal's case.

### 8. snake_case in DB ↔ camelCase in JS
DB columns are snake_case (`contact_name`, `due_date`), component code is camelCase (`contactName`, `dueDate`). Mapping happens in two places:
- **Save**: `lib/db.js` upsert functions convert camelCase → snake_case
- **Load**: `lib/db.js` `loadAllData()` mapping converts snake_case → camelCase

If a field "isn't persisting", check that both directions are mapped correctly. This was the bug behind multiple "linked tasks not saving" issues.

### 9a. User deletion requires ON DELETE SET NULL
Every FK referencing `users(id)` must be `ON DELETE SET NULL`. With the default `NO ACTION`, Postgres rejects deleting any user who owns a task/project/activity row; `run()` swallows the error, the UI removes them optimistically, and they reappear on reload. Users also have an `active` boolean — **deactivation is the preferred path** (preserves attribution); permanent delete leaves their items unassigned. `activeUsers` feeds the team list and every owner picker; `uName()` still resolves deactivated users so history renders. Login checks `active !== false`.

### 9. Never fall back to INIT data on empty DB results
Bug pattern: `data.tasks.length ? data.tasks : INIT_TASKS` makes deleted items reappear. Always use what the DB returns, even if empty arrays.

### 10. Curent dates must be dynamic
Never hardcode dates like `new Date(2026,2,9)` — use `new Date()`. There have been multiple bugs where the dashboard or calendar got stuck on a fixed date.

## File Structure

```
nanu-hub/
├── app/
│   ├── globals.css         # Responsive media queries (768/1024/480 breakpoints)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Imports MarketingHub
├── components/
│   └── MarketingHub.jsx    # MAIN FILE — single component (~3000 lines)
├── lib/
│   ├── supabase.js         # Supabase client init
│   └── db.js               # All DB read/write functions (uses run() wrapper)
├── supabase/
│   ├── 01-schema.sql       # Full schema (idempotent, uses IF NOT EXISTS)
│   ├── 02-seed.sql         # Initial team data
│   ├── 03-webhook.sql      # Notification webhook setup
│   ├── EMAIL-SETUP-GUIDE.md
│   └── functions/
│       ├── send-notification-email/  # Resend integration
│       └── weekly-recap/             # Cron Monday 8am UTC
├── package.json
├── tsconfig.json           # MUST exclude "supabase"
└── next.config.js
```

## Sidebar Navigation Structure

Four collapsible groups in `NAV_GROUPS` constant:

- **Shared:** Dashboard, Team, Calendar, Tasks, Responsibilities, Projects, Stats, Resources, Notes, My Space
- **Marketing:** Content Scheduler (Pallyy), Outreach, Partnerships, Content Ops
- **Community:** Ambassadors, Channels, Events, Feedback, Engagement
- **System:** Settings, Admin (admin-only)

State: `collapsedGroups` tracks which groups are collapsed.

## Section Map (case statements in renderSection)

Each section is a `case` in a switch statement at the top of `renderSection()`:

| Section key | Purpose |
|---|---|
| `dashboard` | Overview, world clocks, weekly themes, alerts |
| `team` | Team cards with social links, admin CRUD |
| `calendar` | **Company calendar** — aggregates events from tasks, projects, partnerships, outreach, community events, key dates, meetings. Month/Week/List views. Person filter (My Calendar / All Team / individual). Event type filter. |
| `pallyy` | Pallyy launch pad (NOT an iframe — they block embedding). Has credentials copy buttons + deep links. |
| `tasks` | Tasks with multi-owner, filter bar, RTF/CSV export. Defaults to "My Tasks" view (taskView state starts "mine"). Admin-only "Master" view (taskView==="master") with select-all, bulk reassign and bulk delete (confirm modal `confirmBulkDeleteTasks`) — switchable board grouped by member/department/project/status, workload summary with overdue + capacity warnings (overloaded at 6+ active tasks), bulk-select + reassign, inline status/priority dropdowns, and a team task report CSV export. Department inferred from role via DEPT_BY_ROLE/userDept(). Guarded by isAdmin so non-admins can't reach it. |
| `responsibilities` | Ongoing duties (recurring or continuous) owned by a person. Separate `responsibilities` table. Cadences: Daily/Weekly/Fortnightly/Monthly/Quarterly/Continuous. advanceDate()/respNextDue()/respIsDue()/markRespDone() helpers. "Mark Done" rolls nextDue forward by cadence. Can generate a one-off task per cycle. Surfaces in: team cards, calendar (projectResp projects occurrences 120 days forward as 'Responsibility' type), My Space (My Responsibilities block + due-this-week on Dashboard), and Master view workload (ongoing count). Pin type 'responsibility' supported. |
| `projects` | Expandable project cards with members, notes, private projects |
| `outreach` | Kanban pipeline with linked tasks |
| `partnerships` | Full partnership tracker with linked tasks, outreach, docs, updates |
| `content-ops` | Ideas, captions, hashtags, messaging pillars, templates |
| `stats` | Followers per platform, week-over-week growth |
| `resources` | Grouped quick links |
| `notes` | Sticky notes with pin-to-top |
| `workspace` | "My Space" — personal tabs (To-Dos, Scratchpad, Bookmarks, Address Book, Goals, Drafts, Activity). Address Book stored in workspace JSONB blob, grouped by category, searchable. |
| `ambassadors` | Ambassador program management |
| `channels` | Community channels (Discord, Reddit, etc.) tracker |
| `events` | Community events (Nanu Orbis, AMAs, meetups) |
| `feedback` | Sentiment-tagged feedback log |
| `engagement` | Weekly in-app metrics dashboard with category breakdown |
| `business` | **Admin + Executive only.** Four tabs: Metrics & KPIs (biz_metrics single JSONB blob, auto-archives previous period for WoW deltas, computes runway = cash/burn), Investors (pipeline grouped by stage), Board Updates (Draft/In Review/Sent), Initiatives (company goals by horizon with progress bars), Access & Backup register (`access_register` — records WHO HOLDS access, NEVER credentials; flags systems with no named backup), Open Seats (`open_seats` — live register with honest hours + urgency), Org Structure (`org_units` — layered chart, sort_order in 10s, holder can be a hub user or free text), Accountability/RACI (`raci_items`), Operating Capability (`moc_items` — minimum vs current vs gap per function, confirmed flag), Documents (indexed by category, expiry warnings, confidential flag, link-based — files live in Drive). Gated by `canSeeBusiness = isAdmin || isExec`; nav group only rendered when true AND the section itself returns a Restricted card otherwise. |
| `focusgroups` | Research rounds with interchangeable heading, start/end dates and a `DeadlineTimeline` (reusable component: one cell per day, colour fades teal→yellow→red toward the deadline, past days dimmed, today ringed; buckets weekly if span >45 days). Four tabs: Participants (traffic-light status Red/Not Sent, Yellow/Sent, Green/Received Back, Blue/Accepted Invite, bulk select + bulk status, admin-only contact-detail toggle via `fgShowContacts`), Surveys & Sending (drag-drop asset zone + staged mass-send requiring explicit confirm), Repository (all received responses), Posting Areas (Pending/Identified/Approved/Declined tabs). Tables: fg_rounds, fg_participants, fg_assets, fg_channels. |
| `media` | **Media & Content** (own nav group). Product-centric: `media_products` (Today in Mystery, Wait Is That Real?, Anomalous Intelligence Report, Close Encounters of the Heard Kind), each with its own pipeline. Six tabs: Pipeline (kanban across 8 stages Idea→Published, arrow buttons move items), Roles (7 standard functions per product, flags unassigned), Ideas Board (open to whole team, upvoting, media-team response), Feedback (typed creative feedback + response), Tools (directory with access holder + shared access), Drive & Assets (link-based; files live in Drive). Tables: media_products, media_items, media_roles, media_ideas, media_feedback, media_tools, media_folders. |
| `settings` | Account card (self-service PIN change via `changePin` modal, validates current PIN) + in-hub notification toggles. Admin resets others' PINs via `resetPin` modal in the Admin panel — note the old inline reset never persisted; always call `db.saveUser`. |
| `admin` | User CRUD, themes, key dates, campaigns, projects |

## Modal Map (case statements in renderModal)

All modals live in a single `renderModal()` switch. Same pattern: `case "editX":` returns `<Modal>...</Modal>`.

Each modal:
1. Reads from `form` state object
2. Updates via `setForm(p => ({...p, field: value}))`
3. Saves via `doSave(()=>{ ...; db.saveX(data) })`
4. Inline buttons only — no FormActions wrapper

## Key UI Patterns

### Linked tasks (outreach, partnerships)
Pattern: dropdown to "Link existing task" + button to "New Task" that auto-creates. Task titles are clickable (teal + cursor:pointer) to open task modal.

### Status badges
Use `<Badge label={...} color={...}/>`. Colours defined in `*_STATUS_COLORS` constants near the top of the file.

### Cards
`<Card theme={theme} style={...} onClick={...}>` — handles dark/light theme automatically.

### Form rows (responsive)
`<div className="nanu-form-row">` — two columns on desktop, stacks on mobile via CSS.

### Section headers
`<SectionHead theme={theme} right={<...buttons.../>}>Title</SectionHead>`

## Responsive Breakpoints

Defined in `app/globals.css`:

- **1024px (tablet landscape)**: 2-col grids → 1-col, sidebar narrows
- **768px (tablet portrait/large phone)**: Sidebar collapses to 58px icons-only, all multi-col grids → 1-col, kanban becomes horizontal scroll, social preview panel goes full-width
- **480px (small phone)**: Further compression, notif panel calc(100vw - 24px)

CSS classes to know:
- `.nanu-sidebar`, `.nanu-sidebar-label`, `.nanu-sidebar-header-text`
- `.nanu-main-pad`, `.nanu-topbar`
- `.nanu-grid-summary`, `.nanu-grid-2col`, `.nanu-grid-notes`, `.nanu-grid-team`
- `.nanu-form-row`, `.nanu-section-head`
- `.nanu-cal-grid`, `.nanu-kanban-col`
- `.nanu-preview-panel`, `.nanu-notif-panel`
- `.nanu-ws-quicklinks`, `.nanu-ws-tabs`, `.nanu-ws-todo-add`, `.nanu-ws-pinned`

## Brand System

- Background: `#050C0F` / `#0D1B21`
- Primary teal: `#1FC2C2`
- Light teal: `#82F9F6`
- Fonts: Syne (display/headings), DM Sans (body), Space Mono (mono/labels)
- 9 category colours (UAP, NHI, Cryptids, Paranormal, Consciousness, Myths & History, Ritual/Occult, Natural Phenomena, Fortean) — defined in component

## Notification System

- In-hub: Bell icon with unread dot, dropdown panel, 30-second polling
- Triggers: Task assigned, task updated, project updated, new members added
- In-hub only — email notifications and Edge Functions were removed.


## Common Tasks & Patterns

### Adding a new section
1. Add nav item to `NAV_GROUPS` (in the right group)
2. Add `case "newsection":` in `renderSection()` switch
3. If it has data: add state, add to `loadAllData`, add INIT data, add save/delete functions in `db.js`, add SQL schema
4. If it has an edit modal: add `case "editNew":` in `renderModal()` switch

### Adding a field to existing data
1. Update INIT data with the new field
2. Update SQL schema (`ALTER TABLE X ADD COLUMN IF NOT EXISTS ...`)
3. Update save function in `db.js` (camelCase → snake_case mapping)
4. Update load mapping in `lib/db.js` `loadAllData()` (snake_case → camelCase)
5. Add input to relevant modal
6. Display field in relevant card/list view

### Database migration workflow
1. Write idempotent SQL in `supabase/01-schema.sql` using `IF NOT EXISTS` and `ALTER TABLE X ADD COLUMN IF NOT EXISTS`
2. User runs the new bits manually in Supabase SQL Editor
3. RLS policies on every new table: `ENABLE ROW LEVEL SECURITY` + `CREATE POLICY "Allow all" FOR ALL USING (true) WITH CHECK (true)` (internal team tool, no need for granular policies)

## Deploy Workflow

The user uses this command pattern when receiving updated zips:

```bash
cd Nanu-Marketing-Hub
rm -rf components app lib supabase public
unzip nanu-marketing-hub.zip
cp -r nanu-hub/* .
cp nanu-hub/.gitignore .
rm -rf nanu-hub
git add -A
git commit -m "<description>"
git push origin main
```

Vercel auto-deploys from `main` branch.

## Known Issues / Pending

- Pallyy iframe embed doesn't work (they block embedding) — current solution is launch pad with credentials + deep links to `app.pallyy.com/dashboard/scheduling/calendar`, `/dashboard/analytics/reports`, `/dashboard/media-library`
- Resend domain verification still uses `onboarding@resend.dev` for testing — needs verified domain for production emails
- "Pin to My Space" buttons not yet added to task/project/outreach cards (infrastructure exists in workspace pinned items)

## Context Files to Read

If you need historical context, useful sources:
- `README.md` in nanu-hub/
- `supabase/EMAIL-SETUP-GUIDE.md` for notification email setup
- The team member context, brand system, and product details about Nanu itself are not in this codebase — ask Nicholas if you need product context

## Style Guide for Code Changes

- Keep changes surgical — this is a 3000-line file, big edits risk breaking things
- Prefer `str_replace` for small changes, full file rewrites only when restructuring whole sections
- Always verify brace balance after edits: `python3 -c "with open('components/MarketingHub.jsx') as f: c=f.read(); print('Balance:', sum(1 if ch=='{' else -1 if ch=='}' else 0 for ch in c))"` should return 0
- Verify no `:any` or `:string` annotations: `grep -c ':any\|:string' components/MarketingHub.jsx` should return 0
- Test responsive at 1024/768/480 viewports for any UI change
- Ask Nicholas before adding new dependencies — keep it lean

## Working Style

Nicholas works fast and direct. Best patterns:
- Ask structured clarifying questions before complex builds (use multi-select format)
- Deliver complete, copy-paste-ready output (zip files, full SQL migrations)
- Provide SQL migrations alongside code changes that need them
- Include the deploy command if relevant
- Surgical edits over rewrites
- Don't over-explain — ship code
