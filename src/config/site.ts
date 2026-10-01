/**
 * Single source of truth for brand, domain and email placeholders.
 *
 * Decided 2026-10-01 (PLAN.md → "Decisions needed"). Change them here
 * only; nothing else in the codebase may hard-code these values.
 */
export const siteConfig = {
  /** Brand name shown in the UI, metadata and emails. */
  name: "AI Remote Work Dashboard",
  /** Apex domain the app is served from. */
  domain: "airemoteworkdashboard.com",
  /** Canonical public URL, used for metadata, sitemaps and email links. */
  url: "https://airemoteworkdashboard.com",
  /** Resend sending subdomain (SPF, DKIM, DMARC verified). */
  senderDomain: "mail.airemoteworkdashboard.com",
  /** From address for the app's emails (on the sending subdomain). */
  senderAddress: "hello@mail.airemoteworkdashboard.com",
  /** Resend receiving subdomain for email auto-capture. */
  inboundDomain: "in.airemoteworkdashboard.com",
  /** Who runs the service, as named in the legal pages. */
  operator: {
    name: "El Barrial Devs",
    city: "Santiago",
    region: "Nuevo León",
    country: "Mexico",
  },
  /** Date the Terms, Privacy and Cookie notices last changed (ISO). */
  legalUpdated: "2026-10-01",
  /** Contact address for users, and for the ingestion User-Agent. */
  supportEmail: "1960bcv@gmail.com",
} as const;

export type SiteConfig = typeof siteConfig;
