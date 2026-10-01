import { z } from "zod";

import { siteConfig } from "@/config/site";

/**
 * Public env vars. Only these may reach the browser; Next.js inlines them at
 * build time, so each one must be referenced by its full literal name.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicSchema>;

export function getPublicEnv(): PublicEnv {
  return publicSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

/**
 * Canonical URL of the site. NEXT_PUBLIC_SITE_URL wins; otherwise Netlify's
 * own URL variable (the site's main address, also on deploy previews), and
 * last the configured production URL.
 */
export function getSiteUrl(): URL {
  // Empty values count as unset.
  const raw = [process.env.NEXT_PUBLIC_SITE_URL, process.env.URL].find(
    (value) => value !== undefined && value !== "",
  );
  return new URL(raw ? z.url().parse(raw) : siteConfig.url);
}

const serverSchema = z.object({
  /** Unset (previews, local, CI): emails are skipped, not sent. */
  RESEND_API_KEY: z.string().startsWith("re_").optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

/** Server-only env vars. Never call from client components. */
export function getServerEnv(): ServerEnv {
  const key = process.env.RESEND_API_KEY;
  return serverSchema.parse({ RESEND_API_KEY: key === "" ? undefined : key });
}
