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
