# CLAUDE.md — AIRemoteWorkDashboard

Read this before every session. The full product spec is `PLAN.md`; where
this file and PLAN.md disagree, **this file wins**.

## What we're building

A free, mobile-first web app where people worldwide discover remote AI-training
jobs (Mercor, micro1, Alignerr, Outlier, etc.) and track their applications on
a personalized dashboard. **The tracker is the product; the job feed is the
hook.** Browsing works without an account; an account is needed to track and
get alerts.

## Working agreement

- **One phase at a time.** Work only on the current phase of the build plan in
  PLAN.md. Stop at each phase's gate and report back. Do not start the next
  phase without explicit approval.
- **Plan first.** Before writing code for a phase, present a short plan (files,
  migrations, decisions) and wait for an OK.
- **Stop for human steps.** Anything needing an account, API key, DNS record or
  dashboard click (GitHub, Netlify, Supabase, Resend) → stop and give exact
  step-by-step instructions. Never guess values.
- **Ask before adding any dependency** not implied by the stack below.
- **Secrets** live in `.env.local` (gitignored). Every variable is documented
  in `.env.example`. No secrets in client code or in git.
- **Open decisions stay as placeholders** in one config file (`src/config/site.ts`):
  `APP_NAME`, `yourdomain.com`, sender domain `mail.yourdomain.com`, inbound
  domain `in.yourdomain.com`. Locales live in `src/i18n/routing.ts`. Never
  hard-code these elsewhere.
- **Small, reviewable commits** with clear messages. Never rewrite pushed
  history.
- Current phase: **Phase 1 — Setup** (see PLAN.md → Build plan).

## Stack (fixed — do not substitute)

- **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**, hosted on
  **Netlify**. Pushes to `main` deploy production; PRs get deploy previews.
- **Supabase**: Postgres, Auth (magic link), RLS, Edge Functions (Deno),
  pg_cron. Separate dev and prod projects. Migrations in
  `supabase/migrations`, functions in `supabase/functions`.
- **Resend** for all email: Auth SMTP, alerts, reminders, weekly recap
  (React Email templates), and inbound receiving for email auto-capture.
- **GitHub** for source and CI (GitHub Actions must pass before merge).
- **Lovable is for visual design only.** Do not invent final visual designs.
  Build clean, token-based components (colors, type, spacing, radii as CSS
  variables wired into the Tailwind theme) so Lovable designs drop in later.

## Quality bar

- TypeScript `strict`, no `any`, no unused code. ESLint + Prettier enforced in
  CI.
- Accessibility: WCAG 2.2 AA, full keyboard support, visible focus, respect
  `prefers-reduced-motion`.
- Performance: Lighthouse 95+ on mobile for performance, accessibility, best
  practices and SEO. Public pages (feed, job, platform) are server-rendered.
- Every user-facing state is designed: loading (skeletons, never spinners),
  empty, error, success.
- Security: RLS on **every** table; no secrets client-side; **Zod validation
  on every server boundary** (route handlers, server actions, Edge Functions,
  webhooks).
- Tests: Vitest for logic, Playwright for key flows, pgTAP/SQL tests for RLS
  policies.
- i18n-ready from day one: every user-facing string goes through the
  translation layer. English first; Spanish may follow.

## Hard scope rules (V1)

- **V1 is completely free.** No Stripe, no Pro tier, no paywalls, no upsell
  nudges, no Resume Tuner, no Interview Simulator.
- **Job data comes only from the platforms themselves.** Never scrape
  competitor boards (aitrainer.work, aitraining.jobs, Skillora, AIWorkfinder,
  AlignList, labelingjobs.net) or **OpenTrain AI** (platform card only).
- Scraping etiquette: official feeds (Greenhouse/Lever/Ashby) first, JSON
  endpoints second, HTML last. Respect robots.txt and terms. One request per
  source per run. Clear User-Agent with a contact email. Back off on errors.
  Store title, pay, tags, dates and a short summary — not full descriptions.
- An adapter returning zero jobs triggers an alert email; it must **not** close
  every job.
- **Every outbound "Apply" click goes through `/go/<job-id>`** (logs the click,
  appends referral code where allowed) with a visible affiliate disclosure.
  Outlier: plain link, no referral.
- Out of V1: headless-browser scraping, community, reviews, native apps.

## Data model (12 tables)

Public read: `platforms`, `playbooks`, `jobs`. Admin only: `ingest_runs`.
Owner-only (RLS `user_id = auth.uid()`): everything user-owned.
`outbound_clicks`: insert via function, admin read.

| Table                | Key columns                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| platforms            | slug, name, site_url, email_domains, referral_url_template, countries_blocked, onboarding_notes                                                        |
| playbooks            | platform_id, stage, next_step, checklist (json)                                                                                                        |
| jobs                 | platform_id, external_id (unique with platform), title, domain, pay_min, pay_max, pay_unit, languages, countries, url, posted_at, last_seen_at, status |
| ingest_runs          | platform_id, started_at, found, inserted, updated, closed, error                                                                                       |
| profiles             | user_id, display_name, country, languages, domains, skills, target_rate, hours_per_week, locale, onboarded_at                                          |
| platform_memberships | user_id, platform_id, status, applied_at, reapply_after, notes                                                                                         |
| tracker_cards        | user_id, kind (job/platform/manual), job_id, platform_id, title, stage, position, applied_at, next_action_at, notes                                    |
| card_events          | card_id, from_stage, to_stage, source (user/email), at                                                                                                 |
| saved_searches       | user_id, filters (json), frequency (daily/weekly), last_sent_at                                                                                        |
| email_prefs          | user_id, alerts_on, reminders_on, recap_on, inbound_token, unsubscribe_token                                                                           |
| inbound_emails       | user_id, from_domain, subject, matched_platform_id, matched_stage, card_id, status (applied/needs_review/ignored)                                      |
| outbound_clicks      | job_id, user_id (nullable), referrer_used, at                                                                                                          |

Key rules:

- Ingestion: pg_cron every 6h → one Edge Function per platform → upsert on
  `(platform_id, external_id)`, set `last_seen_at` → jobs unseen for 2 runs are
  marked `closed` (never deleted) → write an `ingest_runs` row.
- Matching: one Postgres function `match_jobs(user_id)` returns jobs with a
  score and reason tags; feed and dashboard share it. Ineligible jobs hidden.
- Dashboard zones: Today panel, Platform Passport, Matched jobs, Pipeline
  (Kanban, six columns, three card kinds). Rules-based, no AI.
- Email auto-capture: `track+<token>@in.yourdomain.com` → Resend
  `email.received` webhook → Edge Function verifies signature → rules match
  sender domain + keywords → confident match creates/moves a card, otherwise
  "Needs review".

## Codebase map

- `src/app/[locale]/` — all pages (the locale segment is the root layout).
- `src/config/site.ts` — brand/domain/email placeholders.
- `src/i18n/` — next-intl routing, request config, locale-aware `Link`.
  Strings live in `messages/<locale>.json`; the default locale has no URL
  prefix. Read the locale with `next/root-params`, not `setRequestLocale`.
- `src/proxy.ts` — Next.js 16 proxy (formerly middleware): locale routing.
- `src/styles/tokens.css` — design tokens; `src/app/globals.css` maps them
  into Tailwind. `src/lib/utils.ts` has `cn()`; shadcn/ui components go in
  `src/components/ui` (`components.json`).
- `src/lib/env.ts` — Zod-validated env access. `src/lib/supabase/` — server
  and browser clients plus generated `database.types.ts`.
- `supabase/` — `config.toml`, `migrations/`, `functions/`, `tests/database/`
  (pgTAP; includes a guard that every public table has RLS on).
- `e2e/` — Playwright (mobile + desktop, axe checks). `tests/` and
  `src/**/*.test.ts` — Vitest.

This is Next.js 16: APIs differ from older versions. Check
`node_modules/next/dist/docs/` before using an unfamiliar API (see AGENTS.md).

## Commands

Package manager: **pnpm** (Node 22, see `.nvmrc`).

| Command                             | What it does                                                     |
| ----------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                          | Dev server on http://localhost:3000                              |
| `pnpm build` / `pnpm start`         | Production build / serve it                                      |
| `pnpm lint`                         | ESLint (type-checked strict + jsx-a11y strict), zero warnings    |
| `pnpm format` / `pnpm format:check` | Prettier write / check                                           |
| `pnpm typecheck`                    | Generate route types, then `tsc --noEmit`                        |
| `pnpm test`                         | Vitest unit tests                                                |
| `pnpm test:e2e`                     | Playwright against the production build (run `pnpm build` first) |
| `pnpm check`                        | lint + format:check + typecheck + unit tests                     |
| `pnpm db:start` / `pnpm db:stop`    | Local Supabase stack (needs Docker)                              |
| `pnpm db:reset`                     | Re-apply all migrations locally                                  |
| `pnpm db:test`                      | pgTAP tests in `supabase/tests`                                  |
| `pnpm db:types`                     | Regenerate `src/lib/supabase/database.types.ts`                  |

CI (`.github/workflows/ci.yml`) runs all of the above on every PR and push to
`main`. Run `pnpm check` before every commit.
