# CLAUDE.md — AIRemoteWorkDashboard

Read this before every session. The full product spec is `PLAN.md`; where
this file and PLAN.md disagree, **this file wins**.

## What we're building

A free, mobile-first web app where people worldwide discover remote AI-training
jobs (Mercor, micro1, Alignerr, Outlier, etc.) and track their applications on
a personalized dashboard. **The tracker is the product; the job feed is the
hook.** Browsing works without an account; an account is needed to track and
get alerts.

**Sister project (2026-10-02): "AI Remote Work Today"**, a free weekday
email newsletter about the market for human work in AI, drafted by AI agents
and approved by the owner before every send. The newsletter is the primary
product; the dashboard supports it. Its code, docs, decisions and build plan
live in **`cw1960/airemoteworktoday`**; this repo keeps the shared database
and the dashboard-side tasks (see "Newsletter" below).

## Working agreement

- **One phase at a time.** Work only on the current phase of the build plan in
  PLAN.md. Stop at each phase's gate and report back. Do not start the next
  phase without explicit approval.
- **Plan first.** Before writing code for a phase, present a short plan (files,
  migrations, decisions) and wait for an OK.
- **Stop for human steps.** Anything needing an account, API key, DNS record or
  dashboard click (GitHub, Netlify, Supabase, Resend, Beehiiv, Claude
  Console, domain registrar) → stop and give exact
  step-by-step instructions. Never guess values.
- **Ask before adding any dependency** not implied by the stack below.
- **Secrets** live in `.env.local` (gitignored). Every variable is documented
  in `.env.example`. No secrets in client code or in git.
- **Brand and domain live in one config file** (`src/config/site.ts`): name
  "AI Remote Work Dashboard", domain `airemoteworkdashboard.com`, sender
  `mail.airemoteworkdashboard.com` (also the inbound domain for auto-capture),
  contact email, and the operator named in the legal pages (El Barrial Devs,
  Santiago, Nuevo León, Mexico) with the legal pages' last-updated date.
  The newsletter's name ("AI Remote Work Today") and domain live there too
  (`siteConfig.newsletter`). Locales live in `src/i18n/routing.ts`.
  Never hard-code these elsewhere.
- **Small, reviewable commits** with clear messages. Never rewrite pushed
  history.
- Current phase: **Newsletter N4 — Job picks and The Numbers**, database
  side (started early, owner 2026-10-03, while N3's week-of-sources gate
  runs; N1 and N2 are done). The dashboard's open Phase 5–7 items (beta invites, beta
  fixes, Lovable screens) continue alongside (see PLAN.md → Build plan).

## Stack (fixed — do not substitute)

- **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**, hosted on
  **Netlify**. Pushes to `main` deploy production; PRs get deploy previews.
- **Supabase**: Postgres, Auth (magic link), RLS, Edge Functions (Deno),
  pg_cron. Migrations in `supabase/migrations`, functions in
  `supabase/functions`.
  - **One hosted project only: production** (ref `asbpesvfvhkbvicubnfm`).
    There is no hosted dev project (overrides PLAN.md). Develop and test
    against the local Supabase stack (`pnpm db:start`) and CI; never
    experiment on the hosted project.
  - Migrations reach production only deliberately, after CI passes and with
    the user's go-ahead. They must be additive and safe on live data.
  - Deploy previews share the production database, so preview-only features
    must not write test data to it.
- **Resend** for all of the app's own email: Auth SMTP, alerts, reminders,
  weekly recap (React Email templates), and inbound receiving for email
  auto-capture.
- **Beehiiv** (Pro plan) for the newsletter only: publication, landing page,
  subscribers, sends, welcome sequence, referral program, email analytics.
- **Claude API** (`@anthropic-ai/sdk`) for the newsletter agents, which live
  in the separate newsletter repo `cw1960/airemoteworktoday` and run there on
  a scheduled **GitHub Actions** workflow (see Newsletter below).
  In this repo it powers resume tailoring only, from the `tailor-resume`
  Edge Function (key: `ANTHROPIC_API_KEY`, a Supabase function secret).
- **GitHub** for source and CI (GitHub Actions must pass before merge).
- **Lovable is for visual design only.** Do not invent final visual designs.
  Build clean, token-based components (colors, type, spacing, radii as CSS
  variables wired into the Tailwind theme) so Lovable designs drop in later.

## Newsletter: AI Remote Work Today (decided 2026-10-02)

The newsletter's rules, decisions and build plan are in
`cw1960/airemoteworktoday` (`CLAUDE.md`, `PLAN.md`, `docs/`). What matters in
this repo:

1. **Two repos, one database.** This repo owns the shared Supabase
   database: every migration, RLS policy and pgTAP test, the ingestion Edge
   Functions (newsletter-only sources included, N3), `deploy.yml`, the
   site's newsletter signup (N2) and the legal pages. Schema the newsletter
   needs ships here in a PR first; the newsletter repo never runs
   migrations. Its scheduled workflow reaches the database only through
   token-gated SQL functions (the `private.invoke_reminders()` pattern,
   token in Vault), never the service role key.
2. **Newsletter-only job sources.** The site keeps its rules (listed,
   vetted platforms only). The newsletter may also use
   sources stored with the other jobs but **never shown on the site** (feed,
   job pages, sitemap, matching). They are fetched only from official
   public job-board APIs (Greenhouse, Lever, Ashby) or sources whose
   robots.txt **and** terms allow it, checked and recorded in PLAN.md before
   an adapter is built; the scraping etiquette under Hard scope rules
   applies unchanged. A platform's `newsletter_only` flag (copied onto
   its jobs) keeps its jobs off the site: RLS hides them from site reads,
   and every security-definer function that reads jobs filters them
   explicitly. Site jobs also feed the newsletter. Built and vetted
   (2026-10-02) as newsletter-only: Invisible, Welo Data, xAI, RemoExperts;
   all four moved to the site on 2026-10-15. Today only the editor's
   hand-picked listings are newsletter-only.
   Platforms whose terms forbid scraping are never fetched; the editor adds
   their public listings by hand. Competitor boards and OpenTrain AI stay
   off-limits as job sources.
3. **Analytics.** Cookieless and first-party. Beehiiv covers email stats;
   the site records signups (with UTM source) and CTA clicks in Supabase
   without cookies, third-party scripts or personal data, so no consent
   banner is needed. Anything that sets cookies or loads a third-party
   analytics script needs a consent banner first.
4. **Legal.** The Privacy and Cookie notices cover the newsletter (Beehiiv,
   open/click tracking, the AI provider). Keep them in step with what the
   newsletter and the signup form collect. No user personal data is ever
   sent to the AI provider.
5. **Brand.** The newsletter's name and domain (`airemoteworktoday.com`)
   live in `src/config/site.ts` → `newsletter`, like the dashboard's own.

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
  webhooks). New tables get Supabase's default grants (incl. TRUNCATE, which
  RLS ignores): revoke them from `anon`/`authenticated` and grant only the
  columns needed (see the RLS migration; a pgTAP guard enforces it).
- Tests: Vitest for logic, Playwright for key flows, pgTAP/SQL tests for RLS
  policies.
- i18n-ready from day one: every user-facing string goes through the
  translation layer. English first; Spanish may follow.

## Hard scope rules (V1)

- **V1 is completely free.** No Stripe, no Pro tier, no paywalls, no upsell
  nudges, no Interview Simulator.
- **Resume tailoring is in (owner's decision, 2026-10-14)**, free, limited to
  5 generations per user per rolling 24 hours (`private.resume_daily_limit()`).
  It must never invent facts: see Resume tailoring below.
- **Only vetted platforms are listed** (owner's decision, 2026-10-15,
  replacing "referral platforms only" from 2026-10-01). A platform's
  `listed` flag decides what the site names: `/platforms/<slug>` (a 404
  otherwise), the sitemap, the Platform Passport, onboarding and platform
  cards. Listed: Mercor and micro1 (referral links) and Invisible, Welo
  Data, xAI and RemoExperts (plain links, no referral). A listed platform
  can't be `newsletter_only`. The affiliate notice next to Apply shows only
  where `has_referral` (generated from `referral_url_template`) is true.
  Jobs are sorted the same way whatever the platform; platform lists put
  referral platforms first. A new platform needs robots.txt **and** terms
  checked and recorded in PLAN.md before its adapter is built.
- **Referral platforms: Mercor and micro1** (owner's decision, 2026-10-01).
  Vetted and excluded: Handshake AI, Outlier, Terac, Alignerr (terms forbid
  scraping), Turing (blocks bots), Mindrift (no listings or referral
  program). DataAnnotation and SME Careers are unchecked. Mercor's and
  micro1's terms also restrict scraping; the owner chose to keep both
  fetchers running (one light request per 6 h) while seeking permission.
  Any new platform needs robots.txt **and** terms checked before an
  adapter is built.
- **Job data comes only from the platforms themselves.** Never scrape
  competitor boards (aitrainer.work, aitraining.jobs, Skillora, AIWorkfinder,
  AlignList, labelingjobs.net) or **OpenTrain AI** (platform card only).
- Scraping etiquette: official feeds (Greenhouse/Lever/Ashby) first, JSON
  endpoints second, HTML last. Respect robots.txt and terms. One request per
  source per run (exception, approved: an endpoint that caps page size may be
  read page by page, 3 s apart, capped per run — micro1). Clear User-Agent
  with a contact email. Back off on errors (after 3 failed runs in a row, a
  platform is retried once a day).
  Store title, pay, tags, dates and a short summary on the job. Full
  descriptions (owner's decision, 2026-10-15) live only in
  `job_descriptions`, for resume tailoring: never shown on the site,
  readable by signed-in users, written by the service role. Mercor's come
  with each ingest run (no extra requests); micro1's job page is read only
  when a signed-in user opens the tailor, at most once per job (an empty or
  failed read is retried after a day).
- An adapter returning zero jobs triggers an alert email; it must **not** close
  every job.
- **Every outbound "Apply" click goes through `/go/<job-id>`** (logs the click,
  appends referral code where allowed) with a visible affiliate disclosure.
  Outlier: referral link like other platforms, same disclosure (owner's
  decision, 2026-09-30: links are only shown to people who choose a job, so
  this is not spamming). Confirmed link formats: PLAN.md → Monetization.
- Out of V1: headless-browser scraping, community, reviews, native apps.

## Data model (12 tables, plus `site_events` and the newsletter's)

Public read: `platforms`, `playbooks`, `jobs` (site jobs only:
`newsletter_only` jobs are hidden from anon and users; `source` is `feed`
or `manual`, the editor's hand-picked listings). Admin only:
`ingest_runs`.
Owner-only (RLS `user_id = auth.uid()`): everything user-owned.
`outbound_clicks`: insert via function, admin read. `site_events` (newsletter
N2): anonymous signup counts by source and campaign, insert via
`log_site_event()`, admin read, no personal data. Newsletter workflow
(N4): `newsletter_runs` (usage and cost per run), `job_shortlists`,
`social_drafts`; admin only, written and read by the newsletter repo's
workflow only through token-gated `newsletter_*()` functions (newsletter
token in Vault), which read public job data only.

| Table                | Key columns                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| platforms            | slug, name, site_url, email_domains, referral_url_template, has_referral, listed, newsletter_only, countries_blocked, onboarding_notes                 |
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
| master_resumes       | user_id, file_name, file_type (pdf/docx), file_size, content (text only, never the file), is_active                                                    |
| tailored_resumes     | user_id, job_id, master_resume_id, version, job_title, company (snapshots), content (json), review (json), status (draft/saved), saved_at              |
| resume_generations   | user_id, job_id, started_at, finished_at, ok, error, model, input/output tokens (no content; no user access)                                           |

`tracker_cards.tailored_resume_id` points at the saved tailored resume for
that application (set by `save_tailored_resume()`).

Key rules:

- Ingestion: pg_cron every 6h → one Edge Function per platform → upsert on
  `(platform_id, external_id)`, set `last_seen_at` → jobs unseen for 2 runs are
  marked `closed` (never deleted) → write an `ingest_runs` row.
- Matching: one Postgres function `match_jobs(user_id)` returns jobs with a
  score and reason tags; feed and dashboard share it. Ineligible jobs hidden.
- Dashboard zones: Today panel, Platform Passport, Matched jobs, Pipeline
  (Kanban, six columns, three card kinds). Rules-based, no AI.
- Email auto-capture: `track+<token>@mail.airemoteworkdashboard.com` → Resend
  `email.received` webhook → Edge Function verifies signature → rules match
  sender domain + keywords → confident match creates/moves a card, otherwise
  "Needs review".

## Resume tailoring

- Master Profile (`/resume`): the resume text (upload a PDF/DOCX, text
  extracted in memory, file not kept, no OCR; or paste/edit it) plus "Core
  Skills & Evidence". Both are one `master_resumes` version
  (`replace_master_resume()` for uploads, which keeps the evidence;
  `save_master_profile()` for the form), so tailored resumes stay tied to
  what they were made from. No separate profile table.
- Flow: Master Profile → job page "Tailor My Resume for This Job" → the user checks
  the full job description (filled in by the `job-description` Edge
  Function from `job_descriptions` or the micro1 job page; the user pastes
  it when there is none) → the browser calls the `tailor-resume` Edge Function (it
  can run longer than a Netlify function) → a draft opens on
  `/resume/<id>` for review, editing, saving and Word/PDF download.
- The function runs as the user: `start_resume_generation()` checks the job,
  the master resume, one-at-a-time and the daily limit, and returns the
  resume text and evidence;
  `finish_resume_generation()` stores the draft as the job's next version.
  Re-tailoring adds a version; replacing the master keeps old versions while
  tailored resumes use them.
- Model: `claude-opus-5-5`, structured output (`_shared/resume/schema.ts`),
  server-side refusal fallback. Documents are untrusted data in tags they
  can't close (`prompt.ts`); the evidence is sent as `<core_evidence>` and
  counts as fact; `facts.ts` lists anything not in the resume or evidence
  for the user to verify. Never log resume or job text.
- Tests never call the API: the SDK runs against a fake `fetch`.

## The Playbook (book sales)

- `playbook.airemoteworkdashboard.com` sells _The AI Remote Work Playbook_
  (Cris Lopez, PhD) for $19 with a 30-day refund; settings live in
  `src/config/playbook.ts`. `src/proxy.ts` serves the sub-domain's `/` and
  `/thanks` from `src/app/[locale]/playbook/` and sends every other path to
  the main site; the main domain's `/playbook` redirects to the sub-domain
  (other hosts, such as previews and CI, keep `/playbook`).
- Stripe over plain `fetch` (no SDK, `src/lib/playbook/stripe.ts`): the buy
  buttons post to `/api/playbook/checkout` (Checkout Session, price inline).
  `/thanks` and `/api/playbook/download` re-check the session with Stripe
  on every request (paid, not refunded or disputed, within 90 days); the
  session id is the buyer's key. `/api/playbook/webhook` verifies Stripe's
  signature and emails the link once (Resend idempotency key = session id).
- The PDF is `content/playbook/` (never `public/`), bundled with the
  download route only (`outputFileTracingIncludes`).
- Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (Netlify, production).
  Without them the buy button explains checkout is unavailable.
- Copy must come from the book: no invented testimonials, sales numbers or
  fake urgency.
- Promotion in the app is subtle and contextual (`components/playbook/promo.tsx`):
  one card on the signed-out home page, a footer link, a tip on the tracker's
  Assessment and Interviewing columns, on micro1 job pages and by the Master
  Profile's evidence field, and a dashboard card hidden for good by
  `playbook_card_dismissed`. At most one mention per page. Every link carries
  `?ref=<placement>` (`lib/playbook/promo.ts`), which the sales page passes to
  Stripe as session metadata, so Stripe shows which placement sells.

## Codebase map

- `src/app/[locale]/` — all pages (the locale segment is the root layout).
- `src/config/site.ts` — brand/domain/email placeholders.
- `src/i18n/` — next-intl routing, request config, locale-aware `Link`.
  Strings live in `messages/<locale>.json`; the default locale has no URL
  prefix. Read the locale with `next/root-params`, not `setRequestLocale`.
- `src/proxy.ts` — Next.js 16 proxy (formerly middleware): locale routing.
- `src/styles/tokens.css` — design tokens from the Lovable design (dark
  "indigo glass"; the design reference repo is `cw1960/app-brand-builder`);
  `src/app/globals.css` maps them into Tailwind and adds its surface utilities
  (`page-backdrop`, `glass-panel`, `gradient-primary`, `gradient-text`). `src/lib/utils.ts` has `cn()`; shadcn/ui components go in
  `src/components/ui` (`components.json`).
- `src/lib/env.ts` — Zod-validated env access. `src/lib/supabase/` — server
  and browser clients plus generated `database.types.ts`.
- `supabase/` — `config.toml`, `migrations/`, `functions/`, `tests/database/`
  (pgTAP; includes a guard that every public table has RLS on).
- `supabase/functions/ingest/` — the ingestion Edge Function (Deno).
  `supabase/functions/_shared/ingest/` — pure adapters (one per platform),
  shared by Deno and Vitest, tested against recorded fixtures. Storing and
  the closing rule live in SQL: `ingest_jobs()`. pg_cron calls the function
  every 6 h via `private.invoke_ingest()` with a token kept in Vault.
- `src/emails/` — React Email templates (pure, strings passed in);
  `src/lib/email/` — translated rendering, Resend sending (skipped when
  `RESEND_API_KEY` is unset: previews, local, CI) and email prefs. pg_cron
  calls `/api/cron/reminders` daily via `private.invoke_reminders()`; the
  route reads due reminders through token-gated SQL functions (cron token
  in Vault), so the app holds no service role key.
- Legal pages (`/legal/terms|privacy|cookies|affiliates`) and
  `/how-it-works` take their text from `messages/<locale>.json` (`Legal`,
  `HowItWorks`). Only essential cookies are used (sign-in, language,
  `intro_dismissed`), so there is no cookie banner; cookieless first-party
  events are fine, but analytics or ads that set cookies or load
  third-party scripts require a consent banner first.
- `.github/workflows/deploy.yml` — the only way to production: manual
  "Run workflow" (dry run by default) pushes migrations, deploys functions,
  sets function secrets. `scripts/ingest-user-agent.mjs` builds the bot
  User-Agent from `siteConfig`.
- Admin area `/admin` (404 for non-admins; header "Admin" link for
  admins): Overview (site figures, newsletter signups, job source health),
  Users (accounts with email, searchable), Listings and Newsletter (the
  workflow's runs and model spend, job picks, social drafts with Copy
  buttons). Admins are emails
  in `private.admins`: the owner and Amir (owner's decision, 2026-10-03;
  the Privacy Notice says the operator and one administrator can see
  account emails). Every `admin_*` SQL function checks
  `private.is_admin()`; the area is read-only apart from listings.
  Queries in `src/lib/admin/`.
- Hand-picked listings (N3): `/admin/listings`
  (`src/app/[locale]/admin/listings/`) and `src/lib/listings/` (form
  schema, duplicate rules, server actions). Hand-picked jobs have
  `source = 'manual'`, are always newsletter-only and are never closed by
  ingestion.
- Newsletter drafts by email (N4): the newsletter workflow POSTs a run id
  to `/api/newsletter/notify` with its token (`x-newsletter-token`); the
  route reads unsent drafts through token-gated SQL and emails them through
  Resend, LinkedIn drafts to Amir and the rest to the owner
  (`siteConfig.newsletter.draftsTo`; grouping in
  `src/lib/newsletter/drafts.ts`).
- Newsletter signup (N2): `src/components/newsletter-signup.tsx` in the
  footer, on job pages and on the dashboard; `src/lib/newsletter/` holds the
  Zod schema, the Beehiiv API call and the server action, which also counts
  the signup in `site_events`. Needs `BEEHIIV_API_KEY` and
  `BEEHIIV_PUBLICATION_ID` (production only); previews do nothing.
- Email auto-capture: `supabase/functions/inbound-email/` (Resend
  `email.received` webhook, Svix signature check) with pure rules in
  `supabase/functions/_shared/inbound/`; `record_inbound_email()` moves or
  creates the card, or files the email under "Needs review"
  (`src/app/[locale]/dashboard/email-review.tsx`). Settings shows the
  forwarding address only when `INBOUND_EMAIL_ENABLED=true`.
- `src/app/sitemap.ts` — `/sitemap.xml`: public pages, listed platforms and
  open jobs (hourly). `robots.ts` lists it in production only.
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
| `pnpm functions:check`              | `deno check` + `deno lint` for Edge Functions (needs Deno 2)     |
| `pnpm db:start` / `pnpm db:stop`    | Local Supabase stack (needs Docker)                              |
| `pnpm db:reset`                     | Re-apply all migrations locally                                  |
| `pnpm db:test`                      | pgTAP tests in `supabase/tests`                                  |
| `pnpm db:types`                     | Regenerate `src/lib/supabase/database.types.ts`                  |

CI (`.github/workflows/ci.yml`) runs all of the above on every PR and push to
`main`. Run `pnpm check` before every commit.
