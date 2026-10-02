# AI Remote Work Today — Editorial and brand style guide

Draft for the owner to edit (N1, 2026-10-02). The Writer and Editorial QA
agents follow this file; when it changes, they change. Built from the PRD
(`docs/newsletter-prd.md` §3–6, §14, §16) and the sourcing rules in
`CLAUDE.md` → Newsletter, which win if the two ever differ.

## 1. What we are

The daily intelligence briefing on the emerging market for human work in AI.
Not a job board and not an AI hype sheet: a short, trustworthy read that
helps people find, understand and get paid AI work.

Every item must deliver at least one of:

- **Opportunity**: something the reader can apply for.
- **Intelligence**: something changing in the AI labor market.
- **Advantage**: something that improves the reader's chances.
- **Awareness**: something happening they should know about.

If it does none of these, cut it.

## 2. Reader

Global, mixed backgrounds, often reading on a phone, often in their second
language. Four groups (PRD §2): people already doing AI work, professionals
moving into it, people adding income to a job, and skilled people who are
under-employed. Write for a smart reader in a hurry, not for insiders.

## 3. Voice

Intelligent, direct, practical, optimistic without hype, global, economically
aware, skeptical of big claims.

| Do                                                     | Don't                                       |
| ------------------------------------------------------ | ------------------------------------------- |
| Say what happened, then why it matters to the reader   | Open with scene-setting or "In today's…"    |
| Plain words; short sentences; one idea per sentence    | Jargon, buzzwords, "leverage", "unlock"     |
| Name the platform, the role, the number, the date      | "A major AI company", "lots of jobs"        |
| Say what we don't know                                 | Fill gaps with guesses                      |
| Write for every country (state currency, time zone)    | Assume the reader is in the US              |
| Respect the reader's time: cut anything that isn't new | Pad items to a length or repeat yesterday's |

**Banned phrases and ideas** (QA fails the draft on these): "get rich",
"easy money", "guaranteed income", "anyone can make $X", "passive income",
"side hustle that pays $X", "secret", "hack", "you won't believe", "game
changer", "revolutionary", "massive", "insane", "this changes everything",
countdown or fear-of-missing-out urgency ("apply before it's too late"),
and emoji in headlines.

Global English: US spelling, but no idioms or sports metaphors that don't
travel. Spell out abbreviations on first use (RLHF: reinforcement learning
from human feedback), except AI.

## 4. Words we use

| Use                                                 | Not                                     |
| --------------------------------------------------- | --------------------------------------- |
| AI training work, AI work                           | gigs, hustles                           |
| evaluator, rater, annotator, AI trainer, expert     | worker bee, clicker                     |
| platform (Mercor, micro1…)                          | site, company (when it is a platform)   |
| listing, role, opportunity                          | job (fine in headlines when accurate)   |
| advertised pay, advertised at                       | salary, earnings, income (for listings) |
| contract, freelance                                 | employment (unless it is employment)    |
| the platform's own name for each step (assessment…) | our own names for platforms' steps      |
| "reported by <outlet>" for press-only claims        | "sources say"                           |

## 5. Pay

- Always "advertised": **"Advertised at $50–90/hr"**, never "You can make
  $90/hr" or "earn up to $90/hr".
- Copy the figure from the listing exactly. Never round, convert, average or
  annualise. If the listing gives a currency other than USD, show that
  currency. If it says "up to", keep "up to".
- Say the unit as listed: per hour, per task, per study, per month.
- If pay varies by country or level, say so: "Advertised at up to $40/hr;
  rates vary by country."
- No pay in the listing: write "Pay not listed". Never estimate.
- Ranges use an en dash and one currency sign: $50–90/hr.

## 6. Availability

Every opportunity carries exactly one label, taken from the data:

| Label                   | Meaning                                                     |
| ----------------------- | ----------------------------------------------------------- |
| **Currently listed**    | Seen open on the platform in the latest fetch               |
| **Recently announced**  | Announced (post, press release) but no listing seen yet     |
| **Recruiting campaign** | A general call for a skill or language, not one role        |
| **Potentially closed**  | Not seen in the latest fetch, or the page says it may close |
| **Historical example**  | Used to illustrate a trend; not open                        |

Never imply a role is open when the label isn't "Currently listed". Include
the date we last saw it when it matters ("listed as of Oct 2").

## 7. Sources and facts

The full rules are in `CLAUDE.md` → Newsletter → Sourcing rules. In short:

- Every factual claim traces to a stored source. No source, no claim.
- Company claims need a primary source (the company's own site, blog,
  listing or filing). Press-only claims say "reported by <outlet>".
- Pay, availability, qualifications, dates, statistics, URLs and quotes are
  copied from data, never written from memory or inferred.
- Statistics in "The Numbers" come from our SQL queries, verbatim. Say what
  they cover: "43 new listings we tracked today across 9 platforms", not
  "43 new AI jobs".
- Quotes: verbatim, short (one or two sentences), attributed, linked.
- Summarise and link out; never republish an article or a full job
  description.
- Separate announcement from opportunity: "Company X says it will hire
  evaluators" is not a listing.

## 8. Uncertainty

- If a fact is unclear, say so in the text ("the listing doesn't say whether
  this is open outside the US").
- If the agent can't verify something, it marks it `[CHECK: reason]`. QA
  blocks any draft that still contains a `[CHECK` marker; the editor
  resolves or cuts it.
- Don't hedge everything: one clear caveat beats three "may"s.

## 9. Formatting

- **Subject line**: 40–60 characters, specific, no clickbait, no emoji,
  no all caps. Lead with the most useful item: "Mercor wants Spanish legal
  reviewers; robotics data work grows". Preview text adds a second item.
- **Headlines** inside the issue: sentence case, under 70 characters, a fact
  not a tease.
- **Paragraphs**: 1–3 sentences. Bullets for lists of facts.
- **Numbers**: numerals always ("3 roles"), thousands with commas, dates as
  "Oct 2" (year only when not the current one), times with a time zone.
- **Links**: on descriptive words ("micro1's listing"), never "click here".
  Every job's Apply link uses the URL the data gives (our `/go/<job-id>` for
  jobs we hold).
- **Length**: the whole issue reads in about 4 minutes (roughly 700–900
  words).
- **Disclosures** in every issue's footer (see `structure.md`).

## 10. Visual identity

Kept close to the website (`src/styles/tokens.css`, the "indigo glass"
theme). Assets and their sources are in `brand/`.

**Mark.** The site's brand tile (rounded square, indigo gradient, bold "A")
with one addition: a small dot at the top right, standing for the daily
edition. It sets the newsletter's mark apart from the dashboard's while
keeping them clearly related. Don't recolour, stretch, outline or add
effects to it.

**Wordmark.** "AI Remote Work Today" in Plus Jakarta Sans ExtraBold (800),
with "Today" in the indigo gradient on dark backgrounds, or in solid indigo
`#4F5BC9` on light ones.

**Typeface.** Plus Jakarta Sans (the site's font; free under the SIL Open
Font License). Where it isn't available (most email clients), fall back to
the system sans-serif stack: `-apple-system, "Segoe UI", Roboto, Helvetica,
Arial, sans-serif`.

**Colours** (hex for tools that don't take `oklch`):

| Role                                   | Hex                               | From the site token           |
| -------------------------------------- | --------------------------------- | ----------------------------- |
| Background, dark                       | `#0B0D14`                         | `--background`                |
| Text on dark                           | `#EAEBF1`                         | `--foreground`                |
| Muted text on dark                     | `#9697A2`                         | `--muted-foreground`          |
| Primary indigo (on dark)               | `#6C7AE5`                         | `--primary`                   |
| Gradient start / end                   | `#6277D9` → `#4371B7`             | `--gradient-primary`          |
| Page glow (left → right)               | `#4A2A37` → `#130D13` → `#020202` | `--gradient-page`             |
| Accent blue                            | `#609FD2`                         | `--accent`                    |
| Links and buttons **on light** (email) | `#4F5BC9`                         | darker `--primary`, see below |
| Text on light (email)                  | `#1B1D29`                         | —                             |
| Muted text on light (email)            | `#5B5E6E`                         | —                             |
| Email body background                  | `#FFFFFF`, cards `#F6F6FA`        | —                             |

**Email is light, the brand is dark.** The site is dark-only, but dark email
bodies render badly in many clients (Gmail and Outlook recolour them in dark
mode) and are harder to read in long form. So the email uses the dark brand
banner on top and a light body below, with indigo for links and buttons. The
web hub on airemoteworktoday.com can use the dark theme like the site.

**Contrast.** The site's indigo `#6C7AE5` is only 3.8:1 on white, below
WCAG AA for text, so links and buttons on light backgrounds use `#4F5BC9`
(5.7:1 on white, 5.3:1 on `#F6F6FA`), and buttons use white text on it
(5.7:1). Body text `#1B1D29` is 16.7:1; muted `#5B5E6E` is 6.4:1. Muted
`#9697A2` on the dark banner is 6.6:1.

**Images.** Charts and screenshots only when they carry information. Every
image has alt text that says what it shows. No stock photos of laptops on
beaches, no AI-generated people.
