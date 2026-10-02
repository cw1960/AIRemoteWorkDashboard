# AI Remote Work Today — Beehiiv setup

The value for every Beehiiv setting we need, so the publication can be set up
from scratch in one sitting (N1, 2026-10-02). Menu names below follow
Beehiiv's help pages and may differ slightly in the app. With the Beehiiv
connector signed in, Claude can fill in most of these directly, with the
owner's approval for each change.

Items marked **Owner** need a decision or a value only the owner has.

## 0. Before you start

- [ ] **Owner**: delete the old "PrediGana Diario" workspace and its two
      publications (export their subscriber lists first if they may ever be
      needed).
- [ ] **Owner**: create the new workspace and buy **Pro**.
- [x] Postal address for the email footer (required by CAN-SPAM in every
      issue): **PO Box 101, Madisonville, KY 42431, USA** (owner,
      2026-10-02).
- [x] Send days: **weekdays, except US federal holidays** (owner,
      2026-10-02).
- [x] Reply-to: **support@airemoteworktoday.com** (owner, 2026-10-02).
      This mailbox doesn't exist yet: see §2, "Receiving mail".
- [ ] **Owner**: add airemoteworktoday.com to Netlify DNS (§2).

## 1. Workspace and publication

| Setting                  | Value                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace name           | AI Remote Work Today                                                                                                                                                                                                                                                                                                          |
| Publication name         | AI Remote Work Today                                                                                                                                                                                                                                                                                                          |
| Short description        | The daily intelligence briefing on the emerging market for human work in AI.                                                                                                                                                                                                                                                  |
| Long description (about) | AI companies now pay people worldwide to train, test and evaluate their models, from language experts to lawyers to engineers. Every day we pick the most interesting open roles, explain what is changing in this new labor market, and share what helps you get hired. Free, short, sourced, and written for every country. |
| Language                 | English                                                                                                                                                                                                                                                                                                                       |
| Categories / tags        | Careers; Artificial Intelligence; Technology; Remote Work (choose the closest Beehiiv offers)                                                                                                                                                                                                                                 |
| Logo                     | `brand/logo.png` (1024×1024)                                                                                                                                                                                                                                                                                                  |
| Thumbnail                | `brand/thumbnail.png` (1200×630)                                                                                                                                                                                                                                                                                              |
| Time zone                | America/Monterrey (the operator's), unless you prefer another for scheduling                                                                                                                                                                                                                                                  |
| Social links             | None yet. Add LinkedIn and X when the accounts exist (N8)                                                                                                                                                                                                                                                                     |

## 2. Domains

The domain's DNS is managed in **Netlify** (owner, 2026-10-02), like
airemoteworkdashboard.com. The website itself is served by Beehiiv, not
Netlify: Netlify only holds the DNS records.

### Step 1: move the domain's DNS to Netlify

1. In Netlify, open your team's **Domains** page and choose **Add or
   register a domain** (wording may differ slightly). Enter
   `airemoteworktoday.com` and confirm that you already own it.
2. When Netlify offers to set up **Netlify DNS** for it, accept. It may
   offer to copy records it finds at your current DNS host; keep them only
   if they are for a service you use.
3. Netlify then shows **four nameservers** (they look like
   `dns1.p0X.nsone.net`). At the registrar where you bought
   airemoteworktoday.com, replace the domain's nameservers with those four.
4. Wait until Netlify shows the domain's DNS as active. This usually takes
   minutes but can take up to 48 hours.
5. **Don't add this domain to the dashboard site** (or any Netlify site).
   That would point airemoteworktoday.com at the dashboard instead of
   Beehiiv.

### Step 2: add Beehiiv's records

1. In Beehiiv's domain settings, enter the values from the table below. If
   its guided setup doesn't support Netlify, choose **manual setup**.
2. Beehiiv lists the DNS records to add (about 12). For each one, in
   Netlify open **Domains → airemoteworktoday.com → DNS records → Add new
   record** and copy the type, name and value exactly:
   - In Netlify's **Name** field, enter only the part before the domain
     (for `mail.airemoteworktoday.com` enter `mail`; for the domain itself
     leave it empty or use `@`, whichever Netlify accepts).
   - If Beehiiv asks for a CNAME on the domain itself
     (`airemoteworktoday.com`, not a subdomain), add it in Netlify as an
     **ALIAS** record with the same value. DNS doesn't allow a CNAME there.
   - Leave TTL at Netlify's default.
3. Back in Beehiiv, verify the domain. Records can take up to an hour to be
   seen.

### Receiving mail at support@airemoteworktoday.com

Neither Netlify nor Beehiiv hosts mailboxes, so replies to the newsletter
need an email service on the main domain. Beehiiv sends from the `mail.`
subdomain, so the two don't clash. Choose one (**Owner**):

- **Forwarding to your Gmail** (recommended to start): a forwarding
  service such as ImprovMX or Forward Email. Several have a free tier;
  check their current limits. Mail to support@ lands in your Gmail. Replies
  you send come from Gmail, unless you also set up Gmail's "Send mail as"
  with the service's outgoing server.
- **A real mailbox**: Zoho Mail or Google Workspace. Replies come from
  support@ properly; Google Workspace is paid.

Whichever you pick, add its MX and SPF (TXT) records in Netlify the same
way as above, on the domain itself.

### Values for Beehiiv

| Setting         | Value                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Web domain      | `airemoteworktoday.com`                                                                         |
| Redirect domain | `www.airemoteworktoday.com` → `airemoteworktoday.com`                                           |
| Email domain    | New subdomain: `mail.airemoteworktoday.com` (keeps the main domain free for a personal mailbox) |
| DMARC           | Required by Beehiiv on custom domains; add the record it gives you                              |
| Branded links   | On, if offered (links in emails then show airemoteworktoday.com)                                |

## 3. Email sending

| Setting                  | Value                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| From name                | AI Remote Work Today                                                                                           |
| Sender address           | `briefing@mail.airemoteworktoday.com`                                                                          |
| Reply-to                 | `support@airemoteworktoday.com` (needs the mailbox in §2)                                                      |
| Postal address in footer | PO Box 101, Madisonville, KY 42431, USA                                                                        |
| Send days and time       | Weekdays except US federal holidays, 07:00 America/Monterrey (13:00 UTC); revisit the time with open-rate data |
| Double opt-in            | On (better list quality and deliverability; GDPR-friendly)                                                     |

## 4. Email template (post template)

Set up once in the template's style settings; the daily issue (and later the
API) uses it. Values from `style-guide.md` §10.

| Setting                | Value                                                                  |
| ---------------------- | ---------------------------------------------------------------------- |
| Header image           | `brand/banner.png` (1500×500), alt text "AI Remote Work Today"         |
| Body background        | `#FFFFFF`; card/quote blocks `#F6F6FA`                                 |
| Text colour            | `#1B1D29`; secondary `#5B5E6E`                                         |
| Link and button colour | `#4F5BC9`, button text `#FFFFFF`                                       |
| Font                   | Plus Jakarta Sans if listed, otherwise the default sans-serif          |
| Footer blocks          | Items 1–4 from `structure.md` → Footer, then Beehiiv's required footer |

Also create an **empty copy** of this template for the API to post into
later (Beehiiv recommends this for its Create Post API).

## 5. Website (airemoteworktoday.com)

Dark theme, matching the dashboard.

| Setting           | Value                                      |
| ----------------- | ------------------------------------------ |
| Background        | `#0B0D14`                                  |
| Text              | `#EAEBF1`; secondary `#9697A2`             |
| Primary / buttons | `#6C7AE5` (on dark), button text `#FFFFFF` |
| Font              | Plus Jakarta Sans if listed                |
| Favicon           | `brand/logo.png`                           |

### Home page copy

- **Headline**: AI Remote Work Today
- **Subheadline**: The daily briefing on the emerging market for human work
  in AI.
- **Signup button**: Get the free daily briefing
- **Under the form**: Free. One short email each weekday. Unsubscribe
  anytime.
- **What you'll get** (bullets):
  - New AI-work opportunities worth applying for, with advertised pay and
    who can apply
  - Emerging kinds of AI work, from expert evaluation to robotics data
  - What platforms are paying and how it's changing
  - Practical advice to get through onboarding and assessments
  - The developments that matter, checked against their sources
- **Who it's for**: People already doing AI training work, professionals
  who want to put their expertise to work for AI, and anyone looking for
  real, flexible income from it, anywhere in the world.
- **How we work**: Every item is checked against its source. Pay is always
  shown as advertised, never promised. Researched with AI, reviewed by an
  editor.
- **Also from us**: AI Remote Work Dashboard — find AI training jobs and
  track every application, free → `https://airemoteworkdashboard.com`

### Pages

- **About**: the long description (§1), plus "How we work" above.
- **Legal**: link to the privacy policy and terms. The dashboard's privacy
  policy doesn't mention the newsletter or Beehiiv yet; it needs updating
  before the signup page is promoted (see "Open items").

## 6. Subscribe form and signup flow

| Setting                      | Value                                                                   |
| ---------------------------- | ----------------------------------------------------------------------- |
| Form heading                 | Get AI Remote Work Today                                                |
| Form text                    | The best AI-work opportunities and what's changing, free every day.     |
| Button                       | Subscribe free                                                          |
| Fields                       | Email only (no extra questions yet; segmentation comes later)           |
| After signup (double opt-in) | "Check your inbox: we've sent you a link to confirm your subscription." |
| After confirmation           | "You're in. Your first briefing arrives tomorrow morning."              |

## 7. Welcome email (automation)

The full five-email sequence is N7. Set up email 1 now so early subscribers
are greeted. Trigger: new subscriber confirmed.

**Subject**: Welcome to AI Remote Work Today

**Preview**: What you'll get each morning, and how to use it.

**Body**:

> Hi,
>
> Thanks for subscribing to AI Remote Work Today.
>
> AI companies now pay people around the world to train, test and evaluate
> their models: language experts, lawyers, doctors, engineers, writers and
> many more. It's a real new labor market, but the information about it is
> scattered and often hyped.
>
> Each weekday morning you'll get a short briefing with:
>
> - **AI Work Today**: a few open roles worth your attention, with
>   advertised pay and who can apply
> - **The AI Work Market**: what's changing, and why it matters to you
> - **The Numbers**: what our job data shows this week
> - **Worth Knowing**: one practical tip
>
> Two promises: we show pay as advertised, never as a promise of income,
> and every claim is checked against its source.
>
> If you want to keep track of your applications across platforms, our free
> AI Remote Work Dashboard does that: airemoteworkdashboard.com
>
> One favour: reply and tell us what kind of AI work you're looking for. We
> read every reply, and it shapes what we cover.
>
> — The AI Remote Work Today team

## 8. Leave off for now

| Feature                    | When                                                 |
| -------------------------- | ---------------------------------------------------- |
| Referral program           | N7 (share line first; rewards only if readers share) |
| Recommendations network    | After launch, once we have readers to recommend to   |
| Ad network, sponsorships   | Monetization readiness, later (PRD §24)              |
| Paid subscriptions / tiers | Not planned (the newsletter stays free)              |
| Polls, surveys             | Later, if we need reader input for segmentation      |

## Open items

- **Privacy policy**: done in N1 (2026-10-02). The dashboard's Privacy
  Notice now covers the newsletter (Beehiiv, open and click tracking, the
  AI provider), and its Cookie Notice mentions Beehiiv's cookies on the
  newsletter site. In Beehiiv, link the publication's privacy policy to
  `https://airemoteworkdashboard.com/legal/privacy` and its terms to
  `https://airemoteworkdashboard.com/legal/terms`.
- **support@ mailbox**: owner chooses a service (§2).
