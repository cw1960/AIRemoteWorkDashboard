# AI Remote Work Today — Issue structure

Draft for the owner to edit (N1, 2026-10-02). The fixed shape of every daily
issue, from the PRD §5. The Writer fills it in; Editorial QA checks it. How
items are written is in `style-guide.md`.

Format is expected to change once we see what readers open and click
(PRD §26, phase 8). Changes are made here first.

## Overview

| Part                  | Size              | Source of the content                         |
| --------------------- | ----------------- | --------------------------------------------- |
| Header                | banner + 2 lines  | template                                      |
| Today in one line     | 1 sentence        | Writer, from the items below                  |
| 1. AI Work Today      | 3–7 opportunities | Job Intelligence shortlist, editor's picks    |
| 2. The AI Work Market | 1–2 stories       | News Scout → Research notes                   |
| 3. The Numbers        | 3–5 figures       | SQL over our job data, verbatim               |
| 4. Worth Knowing      | 1 item            | Writer, from research notes or a tips backlog |
| Footer                | fixed             | template                                      |

Target: about 4 minutes to read (700–900 words).

## Subject line and preview text

- Subject: 40–60 characters, the most useful item in the issue.
- Preview text: up to 90 characters, the second-best item.
- Both are proposed by the Writer and approved by the editor.

## Header

- Banner image (`brand/banner.png`), alt text: "AI Remote Work Today".
- Date line: "Thursday, Oct 2, 2026".
- Positioning line, fixed: _The daily intelligence briefing on the emerging
  market for human work in AI._

## Today in one line

One sentence that tells a skimming reader what's in the issue. Example:
"Three legal-review roles in Spanish, robotics data work keeps growing, and
the highest advertised rate this week."

## Section 1 — AI Work Today

3–7 opportunities. Favour interesting over newest: rare specialties, unusual
pay, wide geographic access, new kinds of work.

Each opportunity, in this order:

| Field                     | Rule                                                         |
| ------------------------- | ------------------------------------------------------------ |
| **Title**                 | The listing's title, lightly cleaned (no internal codes)     |
| **Platform / company**    | Platform name; the client company if the listing names it    |
| **Pay**                   | "Advertised at …" exactly as listed, or "Pay not listed"     |
| **Specialty**             | Domain or skill (Law, Finance, Spanish, Software…)           |
| **Languages / locations** | As listed; "Location not stated" when missing                |
| **Availability**          | One label from the style guide, with the date last seen      |
| **Why it's interesting**  | One sentence, ours                                           |
| **Caveat**                | One sentence: the key requirement or limit (or "None noted") |
| **Apply**                 | Button/link from the data (`/go/<job-id>` for jobs we hold)  |

Jobs whose Apply link carries a referral code are marked with the short
notice used on the site: "We may earn a referral fee if you're hired. It
never costs you anything."

## Section 2 — The AI Work Market

1–2 developments that change or explain the market (new platforms or expert
networks, funding, robotics data work, agent evaluation, platform rule
changes, pay trends, regulation affecting AI workers).

Each story:

- **Headline**: the fact, under 70 characters.
- **What happened**: 2–3 sentences, with the primary source linked.
- **Why it matters to you**: 1–2 sentences for the reader.
- **What we don't know yet**: 1 sentence when there is real uncertainty.
- **Sources**: linked inline; press-only claims say "reported by <outlet>".

## Section 3 — The Numbers

3–5 one-line figures from our own data, each with its scope. Examples:

- "43 new listings tracked today across 9 platforms."
- "Highest advertised rate: $150/hr (Mercor, medical review)."
- "Most active specialties this week: Finance, Spanish, Software."
- "Fastest-growing category this week: robotics data collection (+12)."

Every figure is copied from a SQL result; the Writer may only phrase it. If a
query returns nothing useful, the line is dropped, not filled.

## Section 4 — Worth Knowing

One short item (under 120 words): application or profile advice, interview
preparation, a skill to learn, a scam warning, how a platform works, or how
pay is calculated. Practical and specific; sourced like everything else.

## Footer

Fixed, in this order:

1. **Share line**: "Know someone trying to break into AI work? Send them
   this issue." (Beehiiv referral link once the program is on, N7.)
2. **Dashboard line**: "Track your applications across platforms, free: AI
   Remote Work Dashboard" → `https://airemoteworkdashboard.com`.
3. **How this is made**: "Researched and drafted with AI, checked against
   our sources, and reviewed by an editor before it's sent. Spot a mistake?
   Reply to this email."
4. **Referral disclosure**: "Some Apply links are referral links: if you're
   hired, the platform may pay us a fee. It never costs you anything and
   doesn't change which jobs we pick."
5. Beehiiv's required footer (unsubscribe, postal address), which can't be
   removed.

## Rules the QA agent checks against this file

- All sections present and in order; section 3 may be shorter, never
  invented.
- 3–7 opportunities, each with every field filled (or the stated fallback).
- Every opportunity has an availability label and a working Apply link.
- Footer items 1–4 present, word for word.
- Subject 40–60 characters, preview text under 90.
