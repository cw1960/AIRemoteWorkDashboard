# AI Remote Work Today — Product Requirements Document & Implementation Plan

> Planning doc for the next project, saved from the owner's PDF
> (`AI_Remote_Work_Today_-_PRD.pdf`, received 2026-10-02). Text is kept as
> written; only formatting was converted to Markdown, and one dollar sign
> the PDF export dropped was restored (§6, "$50–90/hr"). Decisions that
> override this PRD are recorded in `CLAUDE.md` and `PLAN.md` →
> "Newsletter: decisions"; where they disagree, those files win.

**Working title:** AI Remote Work Today

**Core positioning:** The daily intelligence briefing on the emerging market
for human work in AI.

- **Primary product:** Daily email newsletter
- **Supporting product:** AI Remote Work Dashboard
- **Primary asset:** Owned email audience
- **Initial business model:** Free to consumer; monetize audience later

## 1. Product Vision

AI is creating a new labor market in which humans are being paid to:

- evaluate AI
- train AI
- generate training data
- review AI outputs
- provide professional expertise
- create evaluation tasks
- test AI agents
- label physical-world/robotics activity
- perform specialized domain work
- help AI companies improve models and systems

This market is expanding rapidly, but information about it is fragmented
across job platforms, companies, social media, newsletters and communities.

AI Remote Work Today will become a trusted daily source for understanding and
participating in this market.

The product is not simply a job board. It is a media + data + intelligence
product.

## 2. Primary Audience

The audience is global.

The common characteristic is not geography, age, profession or employment
status. It is:

> They believe AI-related remote work could provide a meaningful economic
> opportunity for them.

This includes four major segments.

**Segment A — Existing AI workers.** Already doing AI evaluation, data
annotation, RLHF, AI training, AI testing, AI content work. They want
more/better opportunities.

**Segment B — Professionals entering AI.** People with expertise in medicine,
finance, law, education, engineering, languages, writing, music, science,
business, technology and other professional disciplines. They want to
monetize existing knowledge.

**Segment C — Income supplementers.** People with existing employment who
want additional income.

**Segment D — Unemployed/underemployed skilled people.** People who have
education, skills or professional experience but are struggling to find
adequately compensated traditional employment.

## 3. Editorial Positioning

The publication should occupy this territory: **the emerging market for human
work in AI.**

The newsletter should answer:

1. What AI work is available?
2. Who is paying for it?
3. What does it pay?
4. What kinds of expertise are becoming valuable?
5. What new categories of AI work are emerging?
6. What should someone who wants to participate know today?

This makes the publication broader and more durable than a job roundup.

## 4. Editorial Promise

Every issue should deliver at least one of these:

- **Opportunity** — "Here is something you can apply for."
- **Intelligence** — "Here is something changing in the AI labor market."
- **Advantage** — "Here is something you can do to improve your chances."
- **Awareness** — "Here is something happening that you should know about."

If an item provides none of those, it probably doesn't belong.

## 5. Newsletter Structure

The exact format should be tested, but the initial structure should be:

**Header** — AI Remote Work Today · Date · One-sentence editorial positioning.

**Section 1 — AI Work Today.** Approximately 3–7 selected opportunities. Each
should contain: job title, company/platform, compensation, specialty,
language/location requirements, why it is interesting, important
qualification/caveat, Apply. The editorial team should favor interesting
opportunities, not simply the newest opportunities.

**Section 2 — The AI Work Market.** One or two important developments.
Examples: robotics work expanding, new expert networks, AI agent evaluation,
new types of training work, major platform changes, new compensation
patterns. Amir's current sample demonstrates this category particularly well.
It discusses the expansion from chatbot evaluation into robotics, specialist
evaluation and environment-building.

**Section 3 — The Numbers.** Use our accumulated job data to produce small
market observations. Examples: "Today: 43 new AI-work opportunities
identified." "Highest advertised rate: $X/hr." "Most active specialties:
Finance, languages, software." "Fastest-growing category this week: X." These
should eventually become an important differentiator.

**Section 4 — Worth Knowing.** One useful item. Examples: application advice,
profile advice, interview preparation, skill development, scam warning,
platform explanation, compensation explanation. Keep this section concise.

## 6. Editorial Standards

This is critical. The publication should develop a reputation for usefulness
and trust.

**Compensation.** Never turn an advertised rate into an implied guaranteed
income. Use "Advertised at $50–90/hr" rather than "You can make $90/hr."
Amir's existing sample handles this distinction correctly.

**Availability.** Clearly distinguish: currently listed, recently announced,
recruiting campaign, potentially closed, historical example.

**Claims.** Important factual claims should be supported by the underlying
source.

**Editorial voice.** Intelligent, direct, practical, optimistic without hype,
global, economically aware, skeptical of exaggerated claims.

Avoid: "Get rich with AI", "Guaranteed income", "Easy money", "Anyone can make
$100/hr", hype, clickbait.

The central message is:

> This is a real emerging labor market. Here's how to understand it and
> participate intelligently.

## 7. Automation Architecture

This is one of the most important parts of the project. We should not build
one enormous automation. Build modular agents.

### Agent 1 — Job Scout

- **Input:** 10–15 AI-work platforms.
- **Output:** Normalized opportunity records.

Fields should include: platform, company, job title, URL, compensation,
compensation type, specialty, language, location eligibility, date
discovered, date posted (if available), source, description, status,
confidence/verification status.

The current website may continue to use only Mercor and micro1 because of
scraping/affiliate considerations. The newsletter data layer can be broader.

## 8. Agent 2 — Job Normalizer

Different platforms describe similar information differently. This agent
converts everything into a common schema. For example, "$50–90 hourly"
becomes `min_rate = 50`, `max_rate = 90`, `rate_unit = hourly`. This creates
the foundation for cross-platform analysis.

## 9. Agent 3 — Job Deduplicator

The same opportunity may appear on multiple platforms, multiple times, with
slightly different titles, or after being updated. The agent should identify
likely duplicates.

Output: new / duplicate / updated / uncertain. Uncertain cases go to human
review.

## 10. Agent 4 — Job Intelligence Agent

This agent determines whether a job is newsletter-worthy. Potential criteria:
compensation, professional relevance, uniqueness, number of people who could
qualify, freshness, geographic accessibility, language, unusual opportunity,
emerging category, strategic significance.

Importantly, this is editorial prioritization, not an arbitrary quality score
displayed to users.

## 11. Agent 5 — AI Work News Scout

This is separate from job scraping. Its mission: find developments that
change or illuminate the AI labor market.

Potential subjects: new AI training companies, new expert networks, funding,
acquisitions, robotics data collection, AI evaluation, AI agents, platform
changes, professional expertise demand, compensation trends, regulatory
developments affecting AI workers, major announcements from relevant
companies.

## 12. Agent 6 — Research Agent

When the News Scout finds something interesting: Scout → Research Agent.

The Research Agent:

1. Finds primary source.
2. Finds corroborating sources where appropriate.
3. Extracts relevant facts.
4. Identifies uncertainty.
5. Separates announcement from actual opportunity.
6. Produces structured research notes.

This should happen before the writing agent.

## 13. Agent 7 — Market Intelligence Agent

Periodically analyze the accumulated data. Potential outputs: compensation
trends, specialty demand, language demand, geographic availability, number of
active opportunities, new categories, platform activity, changes in
advertised rates.

This eventually creates proprietary editorial material that competitors
simply aggregating job listings won't have.

## 14. Agent 8 — Newsletter Writer

- **Inputs:** selected jobs, research stories, market statistics, useful
  tip/resource.
- **Output:** Newsletter draft.

The writing agent should have a fixed editorial style guide. It should not
invent: compensation, availability, qualifications, company claims,
statistics, URLs, quotes. If something is uncertain, it should flag it.

## 15. Agent 9 — Social Derivative Agent

One newsletter becomes platform-specific content.

- **LinkedIn** — More substantive. Amir already has approximately 1,500
  subscribers around AI agents and automation, making LinkedIn a natural
  distribution channel for relevant AI-work intelligence.
- **Reddit** — Useful discussion/data contribution. Never simply dump
  promotional newsletter content into communities.
- **X** — Short observations, data points and links.
- **Short video** — Potential scripts: "Three AI jobs paying over $50/hour
  today." "AI work is moving beyond chatbot evaluation. Here's what's
  happening." "This profession is suddenly appearing in AI-training jobs."

## 16. Agent 10 — Editorial QA

Before human review, check:

- **Facts:** Every claim has a source. Compensation is accurately
  represented. Dates are accurate. Links work. No invented information.
- **Editorial:** No hype. No guarantees. No repetitive stories. No obvious
  AI-generated filler. No unsupported conclusions.
- **Formatting:** Headlines, links, bullets, CTA, section structure.

## 17. Human Editorial Review

This remains mandatory. The final pipeline is:

Gather → Research → Analyze → Draft → QA → **HUMAN REVIEW** → Beehiiv

The human review should be fast because the machines have already done the
heavy lifting. The purpose is judgment, not typing.

## 18. Beehiiv Architecture

Create the publication around the newsletter rather than treating Beehiiv as
simply an email sender. Core components:

**Landing page.** Primary message: "AI Remote Work Today — The daily briefing
on the emerging market for human work in AI." CTA: "Get the free daily
briefing." Supporting copy should explain that readers will receive: new
AI-work opportunities, emerging categories, compensation information,
practical intelligence, important developments.

**Welcome sequence.** At minimum:

1. Email 1: Welcome / what the publication is
2. Email 2: How to use the information
3. Email 3: Best opportunities/resources
4. Email 4: Introduce the Dashboard
5. Email 5: Encourage sharing/referrals

The welcome sequence should not overwhelm the subscriber.

## 19. Website Architecture

The website has two jobs: (1) serve the searchable database; (2) capture
newsletter subscribers.

The newsletter CTA should therefore appear throughout the site. Examples:
"Want the best opportunities delivered to you? Get AI Remote Work Today."

## 20. SEO Architecture

The website can eventually create programmatic landing pages from the
underlying job data. Potential categories:

- **Platform:** Mercor AI jobs, micro1 AI jobs
- **Profession:** AI jobs for teachers, lawyers, finance professionals,
  engineers, writers
- **Language:** Spanish, French, Japanese, Portuguese AI jobs
- **Compensation:** AI jobs paying $50+/hr, $100+/hr
- **Category:** AI evaluator, AI trainer, AI data annotation, AI expert, AI
  robotics labeling jobs

The pages should only exist when there is enough useful content to justify
them.

## 21. Newsletter Growth Engine

Every newsletter issue should produce opportunities for audience growth.
Primary acquisition channels:

- **Search** — SEO landing pages.
- **LinkedIn** — Editorial content and market observations.
- **Reddit** — Useful contributions to relevant communities.
- **YouTube** — Short-form AI-work opportunity reports.
- **Referrals** — Subscribers invite other people who want AI work.
- **Partnerships** — Relevant creators, newsletters, communities and career
  organizations.

## 22. The Referral Loop

Build sharing into the publication. At the bottom of each issue: "Know
someone trying to break into AI work? Send them this issue."

Eventually: "Refer 3 friends → receive X". But don't build complex incentives
initially. First determine whether readers naturally share the material.

## 23. The Daily Content Flywheel

10–15 job sources → Job Scout → Normalized database → Job Intelligence →
Newsletter candidates; News Scout → Research → Market Intelligence →
Newsletter Writer → QA → Human Review → AI Remote Work Today → LinkedIn /
Reddit / X / video derivatives → New subscribers → More data → Better
newsletter → More subscribers.

That is the flywheel.

## 24. Monetization Philosophy

No direct consumer paywall initially. Do not prematurely optimize for
revenue. The initial objective is: build the largest high-quality audience
possible within this niche.

Potential future revenue: advertising (newsletter advertising), sponsorship
(direct sponsorship from relevant companies), affiliate (AI tools, education,
career products and other relevant services), paid recommendations (relevant
newsletters/products), digital products (guides, templates, courses,
resources), data/intelligence (eventually, potentially, the accumulated data
itself could support commercial products).

The monetization strategy should remain audience-first.

## 25. Metrics

Subscriber count matters, but it is not the only metric. Track:

- **Acquisition:** new subscribers, subscriber source, conversion rate,
  referral rate
- **Engagement:** open rate, click rate, unsubscribe rate, repeat engagement
- **Content:** which job categories get clicks, which stories get clicks,
  which headlines work, which sections are ignored
- **Website:** newsletter signup conversion, dashboard visits, job-detail
  clicks, apply clicks
- **Business (eventually):** revenue per subscriber, sponsor revenue,
  affiliate revenue, revenue by source

The most important early question is: **Are people repeatedly choosing to
open this newsletter?**

## 26. Ordered Implementation Task List

This is the actual build sequence.

**Phase 1 — Establish the publication**

1. Choose the final publication name. Working recommendation: AI Remote Work
   Today.
2. Establish the editorial positioning: "The daily intelligence briefing on
   the emerging market for human work in AI."
3. Create the Beehiiv publication.
4. Create the newsletter landing page.
5. Create the initial visual identity and basic brand system.
6. Write the editorial style guide. This should include: voice, terminology,
   compensation language, sourcing rules, prohibited hype, treatment of
   uncertainty, formatting conventions.

**Phase 2 — Build the content system**

7. Document the newsletter structure.
8. Build the Job Scout automation.
9. Add the additional job sources. The goal is eventually 10–15 sources.
10. Build the common job-data schema.
11. Build the Job Normalizer.
12. Build the Job Deduplicator.
13. Build the Job Intelligence Agent.
14. Build the AI Work News Scout.
15. Build the Research Agent.
16. Build the Market Intelligence Agent.

**Phase 3 — Build newsletter production**

17. Modify Amir's existing article automation into the new editorial
    framework. Don't throw away the existing automation. Adapt it.
18. Build the Newsletter Writer.
19. Build the Editorial QA Agent.
20. Create the human editorial-review workflow. The output should be "READY
    FOR REVIEW" rather than automatically publishing.
21. Create the Beehiiv publishing workflow. Human approves → publish.

**Phase 4 — Build distribution**

22. Build the LinkedIn derivative automation.
23. Build the Reddit derivative automation.
24. Build the X derivative automation if worthwhile.
25. Build the short-form video script automation.
26. Create a standardized CTA for every distribution channel. The primary CTA
    should be: "Get AI Remote Work Today free every day."

**Phase 5 — Optimize the website for newsletter acquisition**

27. Make newsletter signup a primary CTA on the existing dashboard.
28. Add newsletter signup to job-detail pages.
29. Add newsletter signup to relevant website navigation.
30. Create the first SEO landing pages. Start with high-value categories
    rather than hundreds of pages.
31. Build the programmatic SEO architecture.
32. Connect SEO pages to the underlying job database.

**Phase 6 — Build the subscriber relationship**

33. Create the Beehiiv welcome sequence.
34. Create the referral/share mechanism.
35. Create subscriber segmentation. Potential segments: profession, language,
    geography, AI experience, desired compensation, job category. Don't
    overbuild this initially. Capture information that will actually improve
    the newsletter.

**Phase 7 — Instrument the system**

36. Implement analytics. Track: acquisition source, newsletter signup, email
    engagement, website visit, job click, application click, referral.
37. Create a simple editorial performance dashboard.
38. Track which newsletter stories generate the most clicks, shares,
    subscriptions, website visits.
39. Feed those results back into the editorial system. This creates a genuine
    learning loop.

**Phase 8 — Establish the editorial flywheel**

40. Begin producing the newsletter consistently.
41. Identify the content categories producing the strongest engagement.
42. Increase automation around successful categories.
43. Reduce automation/content categories that don't produce engagement.
44. Develop recurring editorial features. Examples: AI Work Today,
    Highest-Paying Opportunities, AI Work Market Watch, Profession of the
    Day, Global AI Work, What Changed This Week. These should emerge from
    actual reader behavior rather than being permanently locked in now.

**Phase 9 — Growth**

45. Establish the LinkedIn publication/distribution routine.
46. Establish the Reddit participation routine.
47. Develop YouTube/short-video distribution.
48. Identify relevant creators/newsletters for partnerships.
49. Develop a repeatable partnership outreach system.
50. Build subscriber referral mechanics.

**Phase 10 — Monetization readiness**

Do not make monetization the initial priority. Instead, make the
infrastructure monetization-ready.

51. Ensure Beehiiv analytics are sufficient to demonstrate audience quality.
52. Track audience composition.
53. Track engagement by subscriber segment.
54. Create a simple future media/sponsorship information sheet. Eventually it
    can communicate: X subscribers, X% average open rate, X% average click
    rate, X countries, X professional categories.
55. Identify companies whose products naturally serve the audience.
56. Test relevant affiliate relationships.
57. Eventually test direct sponsorships.

## 27. What We Should NOT Build Yet

This is important because the automation possibilities are nearly unlimited.
Do not allow the project to become an endless engineering exercise.

Initially avoid: complicated paid memberships, sophisticated recommendation
algorithms, mobile apps, elaborate social networks, excessive
personalization, dozens of website features, complicated gamification,
massive SEO page generation before validating demand, complicated
monetization infrastructure, fully autonomous publishing.

The goal is to establish: **Excellent content → subscribers → engagement →
repeat readership.** Everything else comes afterward.

## 28. The Fundamental Product Loop

FIND (find what's happening in AI work) → UNDERSTAND (research and interpret
it) → CURATE (determine what's actually worth knowing) → PUBLISH (send it to
subscribers) → DISTRIBUTE (turn it into social/content derivatives) → GROW
(acquire more subscribers) → LEARN (analyze what readers respond to) →
IMPROVE (make the research and editorial system better) → REPEAT.

## 29. The Strategic Goal

The eventual goal is not "Build a popular AI job newsletter." It is:

> Become a trusted information source for people participating in the
> emerging global AI labor market.

If we accomplish that, the business can evolve naturally. The newsletter can
remain free. The website can remain free. The audience can grow. And
eventually companies will have economic reasons to reach that audience.

That creates potential revenue from advertising, sponsorship, affiliate
relationships, partnerships, digital products, data and services — without
requiring us to charge the person who most needs the information.

## 30. The Operating Principle

There are only two people. Therefore: **anything that happens repeatedly
should be a candidate for automation.**

Amir's job is not to manually produce content. Chris's job is not to
manually build every page. Our jobs are to design the system, supervise it,
improve it and make editorial/business decisions.

The machines should do the repetitive work. The humans should do the
judgment. That is the business.
