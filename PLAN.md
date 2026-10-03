# AIRemoteWorkDashboard — PRD Review & MVP Build Plan

Sep 28, 2026 · @Christopher Wheeler

## Summary

Build it, but lead with the tracker, not the job feed. At least six free aggregators already list Mercor, micro1, Outlier and Alignerr jobs, so a feed alone is not a reason to switch. A tracker that knows how these platforms actually onboard people is something none of them offer.

The free MVP is a personalized dashboard (Today panel, Platform Passport, matched jobs, pipeline), a filterable job feed, and email in both directions: alerts, reminders and a weekly recap out; forwarded confirmations in, which update the tracker automatically. No Resume Tuner, no Interview Simulator, no Stripe, no Pro nudges. Revenue in V1 comes only from referral links on outbound clicks.

Stack: GitHub, Supabase, Netlify, Lovable (design only) and Resend, built with AI-assisted coding.

## Market reality

The discovery layer is already crowded and free. Each of these runs a daily-updated feed of AI training jobs, and several also run newsletters and referral links:

| Competitor | What it claims | Our gap to close |
| --- | --- | --- |
| [aitrainer.work](https://aitrainer.work/) | 4,113 roles from 16 platforms, weekly email, resume-tool ads | Scale and SEO head start |
| [aitraining.jobs](https://aitraining.jobs/) | 2,756 jobs, 17 sources incl. OpenTrain, Invisible, Welo | Broadest source list |
| [Skillora](https://skillora.ai/blog/best-ai-training-jobs) | Mercor, micro1, Alignerr, Outlier, DataAnnotation, Terac; daily | Ranked platform guides |
| [AIWorkfinder](https://aiworkfinder.com/) | Free board, daily scrapers | Same free positioning |
| [AlignList](https://alignlist.com/) | Jobs, company reviews, community | Community layer |
| [labelingjobs.net](https://labelingjobs.net/companies/micro1) | Per-platform pages, referral commissions | Same referral model |

Where we can win:

- **The tracker is the product.** None of these boards track a user's pipeline. That is our retention loop and our reason to sign up.
- **Platform-level onboarding tracking.** On micro1 you apply once, pass the Zara interview, then apply to projects. A tracker that models "platform onboarding" and "project applications" separately fits how this work really happens.
- **Language and country filters.** micro1 alone lists roles in 22 non-English languages, and it cannot hire from 20 countries. "Can I apply from here, in my language?" is a filter no board does well.
- **Optional: English + Spanish from day one.** A bilingual site targeting LATAM contractors is a clear niche the English boards ignore.

## PRD review

The vision is sound; the gaps are in data, tracking design, referral mechanics and positioning.

| PRD section | Issue | Recommendation |
| --- | --- | --- |
| 1. Summary | Dollar signs lost in the PDF ("9–19/month", "50 − 100/hr") | Fix before sharing the PRD |
| 3. Value prop | "Thousands of hidden listings" is what competitors already claim | Lead with "track your whole pipeline"; feed is the hook |
| 3. Value prop | "Beat ATS and AI interviewers" reads as gaming the platforms | Reframe as "prepare for"; matters for the Phase 3 B2B pitch |
| 4.1 Aggregator | "Thousands, real-time" is unrealistic at launch | Launch with 4–6 sources, refreshed every 6–12 hours |
| 4.1 Aggregator | Headless browsers don't run on Supabase or Netlify functions | Use sources with public JSON (Mercor's listing endpoint is unauthenticated); add browser scraping only if needed, via a separate worker |
| 4.1 Aggregator | No handling for closed or duplicate listings | Upsert on source + external ID; mark jobs closed when they drop out of the feed |
| 4.1 Aggregator | Filters miss what users care about | Add language, country eligibility, hours/week, posted date |
| 4.2 Tracker | Assumes one card = one job listing | Support platform onboarding cards and manual cards (jobs not in our feed) |
| 4.2 Tracker | No dates, notes or reminders | Add applied date, next-action date, notes, stage history |
| 4.2 Tracker | Upsell nudges | Removed for V1 per your direction |
| 4.3, 4.4 | Pro features | Out of V1 |
| 5. Stack | Lovable outputs Vite + React, PRD says Next.js | Use Lovable screens as the design source, then port components (see Stack) |
| 6. Monetization | "Harvest referral codes from internal dashboards" | Legit for Mercor and micro1 (links on every listing); Outlier too, by the owner's decision (see Monetization) |
| Missing | Email, analytics, legal pages, SEO | Added below |

On referrals specifically: [Mercor](https://talent.docs.mercor.com/policies/referrals) puts a referral link on every listing and doesn't require you to work there. Third-party guides report micro1 pays a flat amount per listing, up to $3,000, after the hire logs 10 paid hours; [Outlier's guidelines](https://outlier.ai/legal/community-guidelines) prohibit spamming personal referral links. Add a plain affiliate disclosure on every outbound link.

## Revised MVP scope

V1 is free, mobile-first, and works without an account for browsing; an account is needed only to track and get alerts.

**In V1**

- Job feed: search plus filters for platform, domain, pay range, language, country eligibility, posted date
- Job pages: one indexable page per listing with JobPosting structured data, "Apply" goes out through a tracked redirect
- Platform pages: one per platform (how onboarding works, pay, countries, open job count)
- Accounts: email magic link via Supabase Auth, plus a 60-second onboarding profile
- Personalized dashboard (see Dashboard): Today panel, Platform Passport, matched jobs with reasons, pipeline with stats
- Tracker: Kanban with the PRD's six columns, drag-and-drop on desktop, swipe on mobile; three card types (feed job, platform onboarding, manual)
- Card details: applied date, next-action date, notes, stage history, platform playbook
- "Track this" button on every job, one tap from feed to board
- Email out: welcome, saved-search alerts, follow-up reminders, weekly recap
- Email in: forwarding address that creates or moves cards automatically
- Legal: privacy policy, terms, affiliate disclosure, unsubscribe

**Out of V1**

- Resume Tuner, Interview Simulator, Stripe, Pro tier, upsell nudges
- Headless-browser scraping (only if a key source has no usable feed)
- Community, reviews, native mobile app

## Dashboard

The dashboard is the product: it opens on "what should I do today to get hired?" and is personalized from a short onboarding profile. Everything here is free in V1 and uses rules, not AI.

**Onboarding (60 seconds, 5 steps):** domains and skills, languages, country, hours per week and target hourly rate, and which platforms they've already joined with their status on each. Users can skip and fill it in later; the dashboard shows what it could do with the missing data.

| Zone | What the user sees | Built from |
| --- | --- | --- |
| Today panel | A ranked action list: follow-ups due, assessments due, new matches since last visit, tracked jobs that closed | next\_action\_at, card stages, new jobs since last login, jobs marked closed |
| Platform Passport | One tile per platform: not joined, applied, interviewing, active, rejected (with reapply date) | platform\_memberships |
| Matched jobs | Jobs ranked by fit, each with plain reasons ("Spanish · Legal · $60/hr · open in Mexico"); ineligible jobs hidden | profile vs job fields, scored in a Postgres function |
| Pipeline | Kanban with the 3 card types, plus stats: applications this week, response rate, days per stage, hourly value in play | tracker\_cards, card\_events |

**What makes it feel alive:**

- **Platform playbooks:** when a card enters a stage, show what usually comes next on that platform and a short prep checklist. You curate these; they're content, not the Pro simulator.
- **Closed-job alerts:** if a tracked job drops out of the feed, it appears on the Today panel.
- **Email auto-capture:** each user gets a private forwarding address. They forward an application confirmation or interview invite, and a card is created or moved for them.
- **Weekly recap email:** applications sent, responses, stage changes, and the week's top 5 matches.
- **Polish:** instant drag-and-drop, swipe to change stage on mobile, a small celebration on "Offered," dark mode, and an empty state that walks new users through their first card.

**How email auto-capture works:**

1. The user forwards the email to `track+<their-token>@in.yourdomain.com`.
2. Resend receives it and calls a Supabase Edge Function webhook (`email.received`).
3. The function verifies the webhook signature, finds the user by token, and fetches the email body.
4. Rules match the sender domain to a platform and keywords to a stage ("thank you for applying" → Applied, "interview" → Interviewing).
5. A confident match creates or moves the card; anything unclear lands in a "Needs review" list on the Today panel.

## Stack

One GitHub repo is the source of truth; Lovable feeds it designs, Netlify deploys it, and Supabase does all the backend work.

(Architecture: Lovable → GitHub → Netlify; visitors → Netlify → Supabase database; job sources → Supabase Edge Functions → database and Resend.)

- **Lovable (design only):** build the 6 core screens there, sync to a separate GitHub repo, and treat that as a component and style reference. Its Tailwind and shadcn/ui components copy into Next.js almost unchanged.
- **GitHub:** the app repo, with Supabase migrations in `supabase/migrations` and Edge Functions in `supabase/functions`. Pushes to `main` deploy production; pull requests get Netlify preview URLs.
- **Netlify:** hosts Next.js (App Router). Job and platform pages are server-rendered so Google can index them; this is the main free acquisition channel. Lovable's default Vite + React output renders in the browser, which is weaker for SEO, hence the port.
- **Supabase:** Postgres, Auth (magic links), row-level security, Edge Functions for ingestion and email, pg\_cron for schedules. Use separate dev and prod projects.
- **Resend:** custom SMTP for Supabase Auth emails, plus job alerts and reminders sent from Edge Functions with React Email templates. Resend's inbound receiving handles forwarded emails for auto-capture. Verify a sending subdomain with SPF, DKIM and DMARC before launch.

## Data model and ingestion

Twelve Postgres tables. Jobs and platforms are public read; everything user-owned is locked to its owner with row-level security.

| Table | Key columns | Access |
| --- | --- | --- |
| platforms | slug, name, site\_url, email\_domains, referral\_url\_template, countries\_blocked, onboarding\_notes | Public read |
| playbooks | platform\_id, stage, next\_step, checklist (json) | Public read |
| jobs | platform\_id, external\_id (unique with platform), title, domain, pay\_min, pay\_max, pay\_unit, languages, countries, url, posted\_at, last\_seen\_at, status | Public read |
| ingest\_runs | platform\_id, started\_at, found, inserted, updated, closed, error | Admin only |
| profiles | user\_id, display\_name, country, languages, domains, skills, target\_rate, hours\_per\_week, locale, onboarded\_at | Owner |
| platform\_memberships | user\_id, platform\_id, status, applied\_at, reapply\_after, notes | Owner |
| tracker\_cards | user\_id, kind (job / platform / manual), job\_id, platform\_id, title, stage, position, applied\_at, next\_action\_at, notes | Owner |
| card\_events | card\_id, from\_stage, to\_stage, source (user / email), at | Owner |
| saved\_searches | user\_id, filters (json), frequency (daily / weekly), last\_sent\_at | Owner |
| email\_prefs | user\_id, alerts\_on, reminders\_on, recap\_on, inbound\_token, unsubscribe\_token | Owner |
| inbound\_emails | user\_id, from\_domain, subject, matched\_platform\_id, matched\_stage, card\_id, status (applied / needs\_review / ignored) | Owner |
| outbound\_clicks | job\_id, user\_id (nullable), referrer\_used, at | Insert via function, admin read |

Job matching runs as a Postgres function (`match_jobs(user_id)`) that returns each job with a score and its reason tags, so the feed and the dashboard share one ranking.

**Ingestion, one adapter per source:**

1. pg\_cron fires every 6 hours and calls a Supabase Edge Function per platform.
2. The adapter fetches the source (JSON endpoint first, HTML parse second) and maps it to the jobs shape.
3. Upsert on (platform\_id, external\_id); set last\_seen\_at.
4. Jobs not seen for 2 runs are marked closed, not deleted, so tracker cards keep their history; users tracking that job see it on their Today panel.
5. Write an ingest\_runs row. If a source returns 0 jobs or errors, Resend emails you an alert.

Store a short summary and the source link, not full job descriptions. It keeps you lighter on the platforms' content and sends the click to them, which is what the referral model needs anyway.

## Job sources

Every listing comes straight from the platform that posts it, never from a competitor board. Of the thirteen platforms checked, six publish clean, structured listings; four need their data calls traced first; three are better treated as platform cards than job feeds.

| Platform | How jobs are published | Adapter approach | Pay in listing | Referral link | Tier |
| --- | --- | --- | --- | --- | --- |
| [Mercor](https://apify.com/studio-amba/mercor-scraper) | Unauthenticated JSON endpoint behind work.mercor.com | Fetch JSON, filter locally | Yes | Yes, per listing | 1 |
| [Invisible](https://job-boards.eu.greenhouse.io/agency/jobs/4381565101) | Greenhouse boards (`agency` for AI Trainer roles, `invisibletech` for staff) | Greenhouse Job Board API | Sometimes | Not found | 1 |
| [Welo Data](https://jobs.lever.co/weloglobal/33babd56-f6d6-4779-8146-498c9a9e42bd) | Lever board `weloglobal` (rater and AI training roles) | Lever postings API | Sometimes, in description | Check | 1 |
| [Alignerr](https://www.alignerr.com/) | Server-rendered pages at alignerr.com/jobs/{id} | Parse HTML list and detail pages | Yes, e.g. $40–120/hr | Check | 1 |
| [DataAnnotation](https://www.dataannotation.tech/) | Server-rendered board, 107 roles at /job-board/{slug} | Parse HTML; all roles share one application | Yes, pay bands | Check | 1 |
| [Terac](https://terac.com/opportunities) | Public opportunities list with spots left per study | Parse HTML; confirm it renders server-side | Yes, per session (often $100–350) or hourly | Reported | 1 |
| [micro1](https://www.micro1.ai/experts/opportunities) | Listings load in the browser after the page opens | Trace the page's data call in dev tools, then fetch that JSON | Yes | Yes, per listing | 2 |
| [Outlier](https://app.outlier.ai/opportunities) | Public opportunities board at app.outlier.ai | Trace the page's data call; small list | Yes, "up to" rates by country | Yes (format to confirm) | 2 |
| [Turing](https://work.turing.com/jobs) | work.turing.com/jobs loads roles in the browser | Trace the page's data call | Yes, e.g. $100/hr | Check | 2 |
| [SME Careers](https://aitrainer.work/platforms/sme-careers) | sme.careers (SuperAnnotate) loads roles in the browser; roughly 200+ roles | Trace the page's data call | Yes | Check | 2 |
| [Handshake AI](https://joinhandshake.com/ai/opportunities/) | Public opportunities page; applying needs a Handshake account | Parse HTML | Yes, "up to" rates | Check | 3 |
| [Mindrift](https://mindrift.ai/) | A few project category pages, one application | Platform card with manual category updates | Monthly caps only | Check | 3 |
| [OpenTrain AI](https://www.opentrain.ai/) | A marketplace that aggregates jobs from 20+ platforms behind a login | Platform card only; do not scrape | Yes, inside the app | Check | 3 |

OpenTrain AI is a competitor as much as a source: it re-lists other platforms' jobs, so it gets a platform card and nothing more. Terac pays per study rather than per hour, which the `pay_unit` column already handles.

**Scraping rules for every adapter:**

- Use official feeds first (Greenhouse, Lever and Ashby all publish public job-board APIs), JSON endpoints second, HTML last.
- Check each site's robots.txt and terms before the first run; our test fetcher was refused by robots.txt on Greenhouse's EU API host, so confirm access there.
- One request per source per run, a clear User-Agent with a contact email, and back off on errors.
- Store title, pay, tags, dates and a short summary, and link out for the full description.
- Watch for layout changes: an adapter that suddenly returns zero jobs triggers the alert email instead of closing every job.

## Build plan

Seven phases, each ending at a gate. Don't start a phase until the previous gate is met; tick tasks off here as they're done.

(Seven phases below, each ending at a gate.)

**Phase 1 — Setup**

- [x] Create the GitHub repo with `supabase/migrations` and `supabase/functions` folders
- [x] Connect Netlify to the repo with deploy previews on pull requests
- [x] Create Supabase dev and prod projects (changed: prod only; local stack for dev)
- [x] Verify the Resend sending domain (SPF, DKIM, DMARC)
- [x] Set up the Resend receiving domain and `email.received` webhook (receiving on `mail.airemoteworkdashboard.com`; webhook to the inbound-email function; tested live 2026-10-02)
- [x] Write `CLAUDE.md` with the schema, stack rules and "no Pro features in V1"

Gate: an empty Next.js page deploys from `main`.

**Phase 2 — Design + data**

- [ ] Lovable screens: onboarding, dashboard, feed, job page, platform page, card detail, settings
- [ ] Sync the Lovable project to its own GitHub repo as the design reference
- [x] Migrations for all twelve tables
- [x] RLS policies: public read on platforms, jobs, playbooks; owner-only on user tables
- [x] Mercor adapter
- [x] micro1 adapter (trace the opportunities page's data call first)
- [x] pg\_cron schedule, ingest\_runs logging, zero-jobs alert email

Gate: real jobs land in the database on schedule.

**Phase 3 — Feed**

- [x] Port Lovable components (Tailwind, shadcn/ui) into Next.js
- [x] Feed with URL-based filters: platform, domain, pay, language, country, posted date
- [x] Server-rendered job pages with JobPosting structured data
- [x] Server-rendered platform pages
- [x] Magic-link sign-in through Supabase Auth with Resend SMTP
- [x] `/go/<job-id>` redirect with click logging and referral codes

Gate: the feed works on a Netlify preview on a phone.

**Phase 4 — Tracker + profile**

- [x] 60-second onboarding (domains, languages, country, rate, hours, platforms joined)
- [x] Kanban with six columns, drag-and-drop on desktop, swipe on mobile (changed: stage tabs and a Move menu on mobile)
- [x] Three card types: feed job, platform onboarding, manual
- [x] Card detail: dates, notes, stage history
- [x] "Track this" on every job
- [x] Welcome email, saved-search alerts, follow-up reminders

Gate: test users have cards on their boards.

**Phase 5 — Dashboard core**

- [x] `match_jobs(user_id)` function with scores and reason tags
- [x] Matched jobs zone, and match reasons on the feed
- [x] Platform Passport with reapply dates
- [x] Today panel: follow-ups, assessments due, new matches, closed jobs
- [x] Closed-job detection feeding the Today panel
- [ ] Invite 10 contractors as beta users

Gate: beta users are active on the dashboard.

**Phase 6 — Dashboard extras**

- [x] Pipeline stats: applications, response rate, days per stage, hourly value in play
- [x] Playbooks written for each launch platform (drafted from the platforms' public help pages; owner reviews the text)
- [x] Email auto-capture: token addresses, webhook, sender and keyword rules, Needs review list (live once the Resend receiving domain and webhook are set up)
- [x] Weekly recap email
- [x] Polish: celebration on Offered, dark mode, empty states (dark mode: the app has a single dark theme)

Gate: beta feedback collected and triaged.

**Phase 7 — Launch**

- [x] ~~Remaining Tier 1 and Tier 2 adapters from the Job sources table; Tier 3 as platform cards~~ Dropped: V1 promotes only Mercor and micro1 (owner's decision, 2026-10-01; see CLAUDE.md)
- [x] Privacy policy, terms, affiliate disclosure
- [ ] Analytics and the metrics listed below (superseded 2026-10-02: cookieless first-party analytics, no banner, built in Newsletter N2; see Newsletter below)
- [x] Sitemap (`/sitemap.xml`, listed in robots.txt) and Search Console (sitemap submitted 2026-10-02)
- [ ] Fix what beta users reported

Gate: public launch.

Build in Claude Code or Cursor against the repo. A short `CLAUDE.md` with the schema, stack rules and "no Pro features in V1" keeps the AI assistant on scope.

## Monetization, metrics and open decisions

V1 earns only through referral links, so every outbound click goes through `/go/<job-id>`, which logs the click and appends the referral code where the platform allows it.

| Platform | Referral model (as reported) | V1 handling |
| --- | --- | --- |
| micro1 | Flat payout per listing, up to $3,000, after 10 paid hours | Referral link on every listing |
| Mercor | 20% of the referral's earnings, capped at 4× their hourly rate | Referral link on every listing |
| Outlier | Per-track links | Referral link (owner's decision, 2026-09-30); format to confirm when its adapter is built |
| Others | Unknown | Plain link until checked |

**Confirmed referral link formats** (codes are the owner's, safe to share; `{id}` = `jobs.external_id`):

| Platform | Link | How confirmed |
| --- | --- | --- |
| micro1 | `https://jobs.micro1.ai/post/{id}?referralCode=425b88c3-88c8-4f6c-9e49-b2adea77e703&utm_source=referral&utm_medium=share&utm_campaign=job_referral` | Two per-job links from the owner's micro1 dashboard |
| Mercor | `https://work.mercor.com/explore?listingId={id}&referralCode=0fed61c9-731f-407b-f095-c500767da8db` | Owner's short link `t.mercor.com/2TkEO` resolves to `work.mercor.com?referralCode=…`; Mercor's site-wide script reads `referralCode` on every page and records the listing |

These figures come from third-party reviews; confirm them in each platform's dashboard before launch.

**Platform vetting (2026-10-01).** V1 promotes only Mercor and micro1 (owner's decision). Checked against robots.txt and terms of service:

| Platform | Result | Reason |
| --- | --- | --- |
| Handshake AI | Excluded | Terms forbid bulk collection of job descriptions by scraping; referral link is one general sign-up link, not per job |
| Outlier | Excluded | Community guidelines forbid crawling or scraping |
| Terac | Excluded | Terms forbid spiders, scrapers and data mining |
| Alignerr | Excluded | Terms forbid crawling, scraping or spidering any page |
| Turing | Excluded | Site blocks bots (Incapsula) |
| Mindrift | Excluded | No job listings or referral program found |
| DataAnnotation, SME Careers | Unchecked | Terms not reachable from the build environment |
| Mercor, micro1 | Kept | Terms also restrict scraping; owner keeps the fetchers running (one request per 6 h) while seeking written permission |

**Metrics to watch from launch:**

- Weekly active users, and the share who have at least 3 tracker cards
- Outbound clicks per active user
- Alert email open and click rate
- Referral sign-ups and paid referrals per platform
- Ingestion health: jobs per source per run, failed runs

**Decisions needed from you:**

- [x] Domain: airemoteworkdashboard.com (bought 2026-10-01, DNS on Netlify)
- [x] Brand name: AI Remote Work Dashboard
- [x] Contact email: 1960bcv@gmail.com
- [x] English only at launch (Spanish may follow; the app is translation-ready)
- [x] Launch sources: Mercor and micro1 only (owner's decision, 2026-10-01)
- [x] Next.js on Netlify
- [x] Sender domain for Resend: mail.airemoteworkdashboard.com (verified; SPF, DKIM and DMARC pass)

## Newsletter: AI Remote Work Today

Sister project (2026-10-02): a free weekday email newsletter on the market for human work in AI, drafted by AI agents and approved by the owner before every send. Its PRD, decisions, editorial docs, brand assets and full build plan (N0–N8) live in **`cw1960/airemoteworktoday`**. This repo owns the shared database, so the newsletter's dashboard-side tasks are tracked here; CLAUDE.md → "Newsletter" has the rules.

**Done here**

- [x] N0: PRD reviewed, six decisions made, build plan approved (PR #39; docs then moved to the newsletter repo)
- [x] N1: Privacy and Cookie notices cover the newsletter (Beehiiv, open/click tracking, the AI provider); newsletter name and domain in `src/config/site.ts`

**N2 — Signups from the site + cookieless analytics** (this repo)

- [x] Privacy policy: add the site's own signup form and `site_events`
- [x] Newsletter signup form (server action → Beehiiv subscriptions API, Zod-validated, UTM source passed on) in the footer of every page, on job pages and on the dashboard (email filled in for signed-in users)
- [x] `site_events` table (RLS, insert via function, admin read) for signups; no cookies, no personal data (button-click counts left out, owner's call 2026-10-02)
- [x] Playwright and axe coverage for the form; previews never write to Beehiiv
- [x] Owner: Beehiiv API key and publication id in Netlify (production only), migration deployed, one real signup tested (2026-10-02)

Gate: real signups arrive in Beehiiv with their source recorded.

**N3 — Newsletter data layer** (this repo)

- [x] Migration: `platforms.newsletter_only` (copied onto each job by trigger); RLS hides newsletter-only jobs from site reads, and the security-definer functions (matching, weekly recap, alerts, `/go`) and tracker cards filter them too. Mercor and micro1 stay site-listed, so their jobs show on the site and feed the newsletter (pgTAP proves both). Of the PRD's job fields, company, specialty and discovered date are the platform, `domain` and `first_seen_at`; verification status comes with manual entry
- [x] Re-check terms and robots.txt, then restore the Invisible, Welo Data and xAI adapters as newsletter-only sources (vetting below)
- [ ] Vet more official job-board sources (Greenhouse, Lever, Ashby) toward 10–15 in total; record each check in this file before building its adapter (2026-10-02: seven platforms vetted, RemoExperts built, see below)
- [x] Editor's manual entry for hand-picked listings (owner-only `/admin/listings`; admins by email in `private.admins`; listings are always newsletter-only and never closed by ingestion)
- [x] Deduplication in code: new / duplicate / updated / uncertain, with uncertain cases in a review list (`src/lib/listings/dedupe.ts`; applied to hand-picked listings)

Gate: at least 5 sources land on schedule for a week, and the site looks exactly as before.

**Newsletter-only source vetting** (checked by the owner, 2026-10-02). A source is built only if robots.txt allows the feed and the terms don't forbid automated access.

| Source | Feed | robots.txt | Terms | Result |
| --- | --- | --- | --- | --- |
| Invisible | Greenhouse `boards-api.greenhouse.io/v1/boards/agency` | `Disallow: /embed/` only, feed allowed | invisibletech.ai has no terms page | Pass |
| Welo Data | Lever `api.lever.co/v0/postings/weloglobal` | `Allow: /`, `Crawl-delay: 1` | welodata.ai has no terms page | Pass |
| xAI | Greenhouse `boards-api.greenhouse.io/v1/boards/xai` | `Disallow: /embed/` only, feed allowed | No scraping, crawling or automated-access wording | Pass |
| RemoExperts (rex.zone) | JSON `www.rex.zone/get-open-opportunities` (what the public Open Opportunities page loads; one request returns every open role) | `User-agent: *` with an empty `Disallow:`, everything allowed | rex.zone has no terms page | Pass |
| Ethos | None: projects are matched privately to expert profiles | n/a | n/a | No public listings |
| Atlas Capture, Neevo (Defined.ai), Pila8, Silencio, TaskVerse (TaskUs) | None: task apps that assign work after sign-up | n/a | n/a | No public listings; hand-picked or news items only |

**N4 — Job picks and The Numbers, database side** (this repo; started early, owner 2026-10-03)

- [x] PR A (#47, deployed 2026-10-03): newsletter token in Vault; `newsletter_runs`, `job_shortlists` and `social_drafts` (admin only); token-gated `newsletter_numbers()` (new jobs, by platform, busiest fields, top advertised hourly rate, fastest-growing field), `newsletter_candidates()` (open jobs, public fields, whether they link through `/go`), and functions to start and finish runs and save shortlists and drafts; pgTAP
- [ ] PR B: `/api/newsletter/notify` emails the drafts through Resend (LinkedIn to Amir, the rest to the owner); a Newsletter tab in `/admin` with runs, cost, shortlist and drafts
- [ ] Owner: deploy, then copy the newsletter token into the newsletter repo's GitHub secrets (exact steps given at the time)

**N4 onwards** happen in the newsletter repo. Any tables or SQL functions they need (token-gated functions for the workflow, The Numbers, sources and research notes, issues) ship here in a PR first.

## Sources

- [Mercor referral policy](https://talent.docs.mercor.com/policies/referrals)
- [Mercor listings via public JSON endpoint (Apify actor notes)](https://apify.com/studio-amba/mercor-scraper)
- [Outlier community guidelines](https://outlier.ai/legal/community-guidelines)
- [micro1 referral terms and country list (Second Talent)](https://www.secondtalent.com/resources/is-micro1-legit/)
- [micro1 referral payout timing (labelingjobs.net)](https://labelingjobs.net/companies/micro1)
- [micro1 language roles (DigiNo)](https://digino.org/ai-training-jobs/micro1/)
- [Mercor 20% referral share (aigigjobs)](https://aigigjobs.vercel.app/platforms/mercor)
- Competitor boards: [aitrainer.work](https://aitrainer.work/), [aitraining.jobs](https://aitraining.jobs/), [Skillora](https://skillora.ai/blog/best-ai-training-jobs), [AIWorkfinder](https://aiworkfinder.com/), [AlignList](https://alignlist.com/)

* [Resend: receiving emails](https://resend.com/docs/dashboard/receiving/introduction)
