/**
 * POST /functions/v1/ingest  {"platform": "mercor" | "micro1"}
 *
 * Fetches one platform's listings and stores them through ingest_jobs(),
 * which logs the run and applies the closing rule. Called by pg_cron with
 * the service role key; anyone else gets 401.
 *
 * Env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (provided by Supabase),
 * INGEST_USER_AGENT (bot name, site URL and contact email; see .env.example).
 */
import { z } from "zod";

import {
  SOURCE_SLUGS,
  SOURCES,
  type SourceResult,
} from "../_shared/ingest/sources.ts";

const bodySchema = z.object({ platform: z.enum(SOURCE_SLUGS) });

const runSummarySchema = z.object({
  run_id: z.number(),
  found: z.number(),
  inserted: z.number(),
  updated: z.number(),
  closed: z.number(),
  skipped: z.number(),
  error: z.string().nullable(),
});
type RunSummary = z.infer<typeof runSummarySchema>;

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Compares secrets without leaking their length or content via timing. */
function safeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

function describe(error: unknown): string {
  const text =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return text.slice(0, 500);
}

async function storeRun(args: {
  platform: string;
  startedAt: string;
  result: SourceResult | null;
  error: string | null;
}): Promise<RunSummary> {
  const response = await fetch(
    `${requireEnv("SUPABASE_URL")}/rest/v1/rpc/ingest_jobs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
        Authorization: `Bearer ${requireEnv("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify({
        p_platform: args.platform,
        p_started_at: args.startedAt,
        p_jobs: args.result?.jobs ?? [],
        p_skipped: args.result?.skipped ?? 0,
        p_error: args.error,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `ingest_jobs failed: HTTP ${response.status} ${await response.text()}`,
    );
  }
  return runSummarySchema.parse(await response.json());
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const auth = req.headers.get("Authorization") ?? "";
  if (serviceKey === "" || !safeEqual(auth, `Bearer ${serviceKey}`)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = bodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return json(
      {
        error: 'Expected {"platform": one of ' + SOURCE_SLUGS.join(", ") + "}",
      },
      400,
    );
  }
  const { platform } = body.data;
  const startedAt = new Date().toISOString();

  let result: SourceResult | null = null;
  let error: string | null = null;
  try {
    result = await SOURCES[platform]({
      fetch,
      sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      userAgent: requireEnv("INGEST_USER_AGENT"),
    });
  } catch (caught) {
    error = describe(caught);
  }

  let summary: RunSummary;
  try {
    summary = await storeRun({ platform, startedAt, result, error });
  } catch (caught) {
    // Storing failed (e.g. a listing broke a constraint): log a failed run
    // so nothing is closed and the alert fires.
    summary = await storeRun({
      platform,
      startedAt,
      result: null,
      error: describe(caught),
    });
  }

  const report = { platform, requests: result?.requests ?? 0, ...summary };
  if (summary.error) console.error("ingest failed", report);
  return json(report, summary.error ? 502 : 200);
});
