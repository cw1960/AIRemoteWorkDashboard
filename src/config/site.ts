/**
 * Single source of truth for brand, domain and email placeholders.
 *
 * The domain is decided (airemoteworkdashboard.com, 2026-10-01); the brand
 * name and support email are still open (PLAN.md → "Decisions needed").
 * Change them here only; nothing else may hard-code these values.
 */
export const siteConfig = {
  /** Brand name shown in the UI, metadata and emails. */
  name: "APP_NAME",
  /** Apex domain the app is served from. */
  domain: "airemoteworkdashboard.com",
  /** Canonical public URL, used for metadata, sitemaps and email links. */
  url: "https://airemoteworkdashboard.com",
  /** Resend sending subdomain (SPF, DKIM, DMARC verified). */
  senderDomain: "mail.airemoteworkdashboard.com",
  /** Resend receiving subdomain for email auto-capture. */
  inboundDomain: "in.airemoteworkdashboard.com",
  /** Contact address for users, and for the ingestion User-Agent. */
  supportEmail: "hello@yourdomain.com",
} as const;

export type SiteConfig = typeof siteConfig;
