#!/usr/bin/env node
// Builds the ingestion User-Agent from src/config/site.ts. While the brand,
// domain or support email are still placeholders, falls back to the GitHub
// repository name and URL and to INGEST_CONTACT_EMAIL.
const { siteConfig: s } = await import("../src/config/site.ts");
const isPlaceholder = (value) =>
  value === "APP_NAME" || value.includes("yourdomain.com");
const repo = process.env.GITHUB_REPOSITORY ?? "";
const email = isPlaceholder(s.supportEmail)
  ? process.env.INGEST_CONTACT_EMAIL
  : s.supportEmail;
if (!email) {
  console.error(
    "No contact email: siteConfig.supportEmail is a placeholder and INGEST_CONTACT_EMAIL is not set.",
  );
  process.exit(1);
}
const name = isPlaceholder(s.name) ? repo.split("/")[1] : s.name;
const url = isPlaceholder(s.url) ? `https://github.com/${repo}` : s.url;
process.stdout.write(`${name.replace(/\s+/g, "")}-bot/1.0 (+${url}; ${email})`);
