# CLAUDE.md — AIRemoteWorkDashboard

Read this before every session. The full product spec is `PLAN.md`; where
this file and PLAN.md disagree, **this file wins**.

## What we're building

A free, mobile-first web app where people worldwide discover remote AI-training
jobs (Mercor, micro1, Alignerr, Outlier, etc.) and track their applications on
a personalized dashboard. **The tracker is the product; the job feed is the
hook.** Browsing works without an account; an account is needed to track and
get alerts.

**Next project (2026-10-02): "AI Remote Work Today"**, a free daily email
newsletter about the market for human work in AI, built on this platform with
AI agents doing the research and drafting and a human approving every issue.
The newsletter is the primary product; the dashboard supports it. Spec:
`docs/newsletter-prd.md`; decisions that override it are below under
"Newsletter: AI Remote Work Today"; build plan in PLAN.md → Newsletter.

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
  The newsletter's name ("AI Remote Work Today") and domain go in the same
  file when its first phase adds them. Locales live in `src/i18n/routing.ts`.
  Never hard-code these elsewhere.
- **Small, reviewable commits** with clear messages. Never rewrite pushed
  history.
- Current phase: **Newsletter N1 — Publication setup** (plan approved
  2026-10-02; see PLAN.md → Newsletter build plan). The
  dashboard's open Phase 5–7 items (beta invites, beta fixes, Lovable
  screens) continue alongside (see PLAN.md → Build plan).

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
- **Claude API** (`@anthropic-ai/sdk`, added in the newsletter phase that
  first needs it) for the newsletter agents, run by a scheduled **GitHub
  Actions** workflow on `main` (see Newsletter below).
- **GitHub** for source and CI (GitHub Actions must pass before merge).
- **Lovable is for visual design only.** Do not invent final visual designs.
  Build clean, token-based components (colors, type, spacing, radii as CSS
  variables wired into the Tailwind theme) so Lovable designs drop in later.

## Newsletter: AI Remote Work Today (decided 2026-10-02)

The owner's answers to the six open questions. They override
`docs/newsletter-prd.md` where the two differ.

1. **Job sources.** The site keeps its rules (referral platforms only,
   Mercor and micro1 promoted). The newsletter may also use
   **newsletter-only sources**, stored with the other jobs but never shown
   on the site (feed, job pages, sitemap, matching):
   - Automated fetching only from official public job-board APIs
     (Greenhouse, Lever, Ashby) or sources whose robots.txt **and** terms
     allow it, checked and recorded in PLAN.md before an adapter is built.
     The scraping etiquette under Hard scope rules applies unchanged. First
     candidates: the Invisible, Welo Data and xAI adapters from the reverted
     PR #13 (re-check their terms first).
   - Platforms whose terms forbid scraping (Outlier, Alignerr, Terac,
     Handshake AI, Turing) are **never fetched**. They appear only as
     listings the editor adds by hand from a public page, or in news items.
     Asking those platforms for permission is a parallel owner task.
   - Competitor boards and OpenTrain AI stay off-limits as job sources.
2. **Email tool.** Beehiiv sends the newsletter, on the **Pro plan from day
   one** so approved issues reach Beehiiv by API and welcome automations are
   available. Resend keeps every app email. The two send from different
   domains so neither affects the other's deliverability.
3. **AI agents.** Claude API, called from TypeScript in this repo, run by a
   daily scheduled GitHub Actions workflow on `main` only (never from CI,
   previews or local runs against production; Edge Functions' time limits
   are too short for research). Its secrets are GitHub Actions secrets.
   - Plain code, not an LLM, wherever the job is mechanical: fetching, pay
     parsing (Normalizer), duplicate matching (Deduplicator), link checks,
     and every number in "The Numbers" (SQL). An LLM only handles
     what code can't (unparseable pay text, uncertain duplicates).
   - Models: Sonnet 5.5 for the News Scout, Research and Job Intelligence
     agents (web search), Haiku 4.5 for edge-case parsing, Opus 5.5 for the
     Writer and Editorial QA. Budget: roughly $2–4/day (~$60–120/month,
     including web search at $10 per 1,000 searches), with a monthly spend
     limit set in the Claude Console. Measure real usage in the first week
     and report it.
   - No user personal data (profiles, emails, tracker cards) is ever sent to
     the LLM. Agents read only public job data and the open web.
   - **Sourcing rules (non-negotiable):**
     - Every factual claim in a draft maps to a stored source (URL,
       publisher, date fetched, the supporting excerpt). The Writer gets
       only structured research notes and job records, and may state nothing
       that isn't in them.
     - Claims about a company need a primary source (its own site, blog,
       listing or filing). Press coverage alone is labelled "reported by
       <outlet>".
     - Pay, availability, qualifications, dates, statistics, URLs and quotes
       are copied from data, never generated. Pay is always "advertised at…",
       never implied income. Availability uses the PRD's labels (currently
       listed / recently announced / recruiting campaign / potentially
       closed / historical example).
     - Quotes are verbatim, short and attributed. Summarise and link; never
       republish articles.
     - Every link must be in the sources table and return 2xx when QA runs.
       Jobs we hold link through `/go/<job-id>`, with the affiliate
       disclosure in every issue.
     - Anything uncertain is flagged in the draft. An issue can't be marked
       ready for review while flags remain.
     - Each issue says it is researched and drafted with AI and reviewed by
       an editor.
4. **Analytics.** Cookieless and first-party. Beehiiv provides email
   opens, clicks, subscriber source and referrals. The site records a few
   events (newsletter signup with its UTM source, CTA clicks) in Supabase
   alongside `outbound_clicks`, with no cookies, no third-party script and
   no personal data, so no consent banner is needed. Anything that sets
   cookies or loads a third-party analytics script still needs a consent
   banner first. The privacy policy is updated to name Beehiiv and the AI
   provider before the first signup form ships.
5. **Brand and domain.** Two names. The newsletter is **AI Remote Work
   Today** on its own domain, `airemoteworkdaily.com` (bought 2026-10-02;
   the owner keeps the "Today" name with this domain), which hosts the
   Beehiiv web hub and newsletter sending. The
   dashboard keeps its name, domain and email setup, and the two cross-link.
   Both live in `src/config/site.ts`.
6. **People.** The owner (Chris) is the editor and approves every issue;
   nothing is published without that approval (no autonomous publishing).
   Amir shares his existing article automation (tools, prompts, 2–3 sample
   outputs), which is saved under `docs/` and adapted into the Writer, not
   kept as a separate system. Amir gets no access to production services
   unless the owner decides otherwise.

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
  nudges, no Resume Tuner, no Interview Simulator.
- **Only platforms with a referral program get a fetcher** (owner's decision,
  2026-10-01: referrals are how the app earns). Build an adapter only after
  the platform's referral link format is confirmed and recorded in PLAN.md →
  Monetization. Exception: newsletter-only sources, which never appear on
  the site (see Newsletter → Job sources). Greenhouse/Lever adapters for
  Invisible, Welo Data and xAI were built in PR #13 and reverted for this
  reason; restore them from git history if those platforms add referral
  programs, or as newsletter-only sources. Platform pages follow
  the same rule: `/platforms/<slug>` is a 404 until the platform has a
  `referral_url_template`.
- **V1 promotes only Mercor and micro1** (owner's decision, 2026-10-01).
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
  Store title, pay, tags, dates and a short summary — not full descriptions.
- An adapter returning zero jobs triggers an alert email; it must **not** close
  every job.
- **Every outbound "Apply" click goes through `/go/<job-id>`** (logs the click,
  appends referral code where allowed) with a visible affiliate disclosure.
  Outlier: referral link like other platforms, same disclosure (owner's
  decision, 2026-09-30: links are only shown to people who choose a job, so
  this is not spamming). Confirmed link formats: PLAN.md → Monetization.
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
- Email auto-capture: `track+<token>@mail.airemoteworkdashboard.com` → Resend
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
