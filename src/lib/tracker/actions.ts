"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { endPosition, STAGES } from "./stages";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: "invalid" | "auth" | "failed" };

const moveSchema = z.object({
  id: z.uuid(),
  stage: z.enum(STAGES),
});

/**
 * Moves a card to the end of another column. The stage change is recorded
 * in card_events by a trigger; the first move to Applied sets applied_at.
 */
export async function moveCard(input: unknown): Promise<ActionResult> {
  const parsed = moveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };
  const { id, stage } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const [column, current] = await Promise.all([
    supabase
      .from("tracker_cards")
      .select("position")
      .eq("user_id", user.id)
      .eq("stage", stage)
      .neq("id", id),
    supabase
      .from("tracker_cards")
      .select("applied_at")
      .eq("user_id", user.id)
      .eq("id", id)
      .maybeSingle(),
  ]);
  if (column.error || current.error || !current.data) {
    return { ok: false, error: current.data ? "failed" : "invalid" };
  }

  const { error } = await supabase
    .from("tracker_cards")
    .update({
      stage,
      position: endPosition(column.data.map((c) => c.position)),
      ...(stage === "applied" && !current.data.applied_at
        ? { applied_at: new Date().toISOString() }
        : {}),
    })
    .eq("user_id", user.id)
    .eq("id", id);
  if (error) {
    console.error("card not moved", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, id };
}

const addSchema = z.object({
  title: z.string().trim().min(1).max(300),
});

/** Adds a manual card to the end of Saved. */
export async function addManualCard(input: unknown): Promise<ActionResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };

  const supabase = await createSupabaseServerClient();
  const { data: column, error: readError } = await supabase
    .from("tracker_cards")
    .select("position")
    .eq("user_id", user.id)
    .eq("stage", "saved");
  if (readError) return { ok: false, error: "failed" };

  const { data, error } = await supabase
    .from("tracker_cards")
    .insert({
      kind: "manual",
      title: parsed.data.title,
      stage: "saved",
      position: endPosition(column.map((c) => c.position)),
    })
    .select("id")
    .single();
  if (error) {
    console.error("card not added", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, id: data.id };
}

/** Postgres unique_violation. */
const UNIQUE_VIOLATION = "23505";

const trackJobSchema = z.object({ jobId: z.guid() });

/**
 * Adds a job to the end of Saved. Tracking a job twice is fine: the
 * existing card is kept (one card per job per user).
 */
export async function trackJob(input: unknown): Promise<ActionResult> {
  const parsed = trackJobSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };

  const supabase = await createSupabaseServerClient();
  const [job, existing, column] = await Promise.all([
    supabase
      .from("jobs")
      .select("id, title")
      .eq("id", parsed.data.jobId)
      .maybeSingle(),
    supabase
      .from("tracker_cards")
      .select("id")
      .eq("user_id", user.id)
      .eq("kind", "job")
      .eq("job_id", parsed.data.jobId)
      .maybeSingle(),
    supabase
      .from("tracker_cards")
      .select("position")
      .eq("user_id", user.id)
      .eq("stage", "saved"),
  ]);
  if (job.error || existing.error || column.error) {
    return { ok: false, error: "failed" };
  }
  if (!job.data) return { ok: false, error: "invalid" };
  if (existing.data) return { ok: true, id: existing.data.id };

  const { data, error } = await supabase
    .from("tracker_cards")
    .insert({
      kind: "job",
      job_id: job.data.id,
      title: job.data.title.slice(0, 300),
      stage: "saved",
      position: endPosition(column.data.map((c) => c.position)),
    })
    .select("id")
    .single();
  if (error) {
    // Tracked at the same moment elsewhere (one card per job): fine.
    if (error.code === UNIQUE_VIOLATION) {
      const again = await supabase
        .from("tracker_cards")
        .select("id")
        .eq("user_id", user.id)
        .eq("kind", "job")
        .eq("job_id", job.data.id)
        .maybeSingle();
      if (again.data) return { ok: true, id: again.data.id };
    }
    console.error("job not tracked", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, id: data.id };
}

const trackPlatformSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
});

/** Adds an onboarding card for a listed platform to Saved (once). */
export async function trackPlatform(input: unknown): Promise<ActionResult> {
  const parsed = trackPlatformSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };

  const supabase = await createSupabaseServerClient();
  const { data: platform, error: platformError } = await supabase
    .from("platforms")
    .select("id, name")
    .eq("slug", parsed.data.slug)
    .not("referral_url_template", "is", null)
    .maybeSingle();
  if (platformError) return { ok: false, error: "failed" };
  if (!platform) return { ok: false, error: "invalid" };

  const [existing, column] = await Promise.all([
    supabase
      .from("tracker_cards")
      .select("id")
      .eq("user_id", user.id)
      .eq("kind", "platform")
      .eq("platform_id", platform.id)
      .maybeSingle(),
    supabase
      .from("tracker_cards")
      .select("position")
      .eq("user_id", user.id)
      .eq("stage", "saved"),
  ]);
  if (existing.error || column.error) return { ok: false, error: "failed" };
  if (existing.data) return { ok: true, id: existing.data.id };

  const { data, error } = await supabase
    .from("tracker_cards")
    .insert({
      kind: "platform",
      platform_id: platform.id,
      title: platform.name,
      stage: "saved",
      position: endPosition(column.data.map((c) => c.position)),
    })
    .select("id")
    .single();
  if (error) {
    // Tracked at the same moment elsewhere (one card per platform): fine.
    if (error.code === UNIQUE_VIOLATION) {
      const again = await supabase
        .from("tracker_cards")
        .select("id")
        .eq("user_id", user.id)
        .eq("kind", "platform")
        .eq("platform_id", platform.id)
        .maybeSingle();
      if (again.data) return { ok: true, id: again.data.id };
    }
    console.error("platform not tracked", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true, id: data.id };
}
