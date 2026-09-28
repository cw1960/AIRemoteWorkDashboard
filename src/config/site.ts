/**
 * Single source of truth for brand, domain and email placeholders.
 *
 * These are open decisions (see PLAN.md → "Decisions needed"). Change them
 * here only; nothing else in the codebase may hard-code these values.
 */
export const siteConfig = {
  /** Brand name shown in the UI, metadata and emails. */
  name: "APP_NAME",
  /** Apex domain the app is served from. */
  domain: "yourdomain.com",
  /** Canonical public URL, used for metadata, sitemaps and email links. */
  url: "https://yourdomain.com",
  /** Resend sending subdomain (SPF, DKIM, DMARC verified). */
  senderDomain: "mail.yourdomain.com",
  /** Resend receiving subdomain for email auto-capture. */
  inboundDomain: "in.yourdomain.com",
  /** Contact address for users, and for the ingestion User-Agent. */
  supportEmail: "hello@yourdomain.com",
} as const;

export type SiteConfig = typeof siteConfig;
