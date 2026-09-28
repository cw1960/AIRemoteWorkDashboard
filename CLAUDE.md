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
  domain `in.yourdomain.com`, locales. Never hard-code these elsewhere.
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

| Table | Key columns |
| --- | --- |
| platforms | slug, name, site_url, email_domains, referral_url_template, countries_blocked, onboarding_notes |
| playbooks | platform_id, stage, next_step, checklist (json) |
| jobs | platform_id, external_id (unique with platform), title, domain, pay_min, pay_max, pay_unit, languages, countries, url, posted_at, last_seen_at, status |
| ingest_runs | platform_id, started_at, found, inserted, updated, closed, error |
| profiles | user_id, display_name, country, languages, domains, skills, target_rate, hours_per_week, locale, onboarded_at |
| platform_memberships | user_id, platform_id, status, applied_at, reapply_after, notes |
| tracker_cards | user_id, kind (job/platform/manual), job_id, platform_id, title, stage, position, applied_at, next_action_at, notes |
| card_events | card_id, from_stage, to_stage, source (user/email), at |
| saved_searches | user_id, filters (json), frequency (daily/weekly), last_sent_at |
| email_prefs | user_id, alerts_on, reminders_on, recap_on, inbound_token, unsubscribe_token |
| inbound_emails | user_id, from_domain, subject, matched_platform_id, matched_stage, card_id, status (applied/needs_review/ignored) |
| outbound_clicks | job_id, user_id (nullable), referrer_used, at |

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

## Commands

_Filled in during Phase 1 (dev, build, lint, typecheck, test, e2e, db)._
