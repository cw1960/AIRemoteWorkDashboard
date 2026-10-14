"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { storedResumeSchema } from "../../../supabase/functions/_shared/resume/schema";
import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { type ExtractError, extractResumeText } from "./extract";

export type UploadResult =
  | { ok: true }
  | { ok: false; error: ExtractError | "auth" | "missing" | "failed" };

/**
 * Stores an uploaded resume's text as the new master resume. The file
 * itself is read in memory and not kept. Earlier tailored resumes keep the
 * version they were made from.
 */
export async function uploadMasterResume(
  formData: FormData,
): Promise<UploadResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "missing" };
  }

  const extracted = await extractResumeText(
    file.name,
    new Uint8Array(await file.arrayBuffer()),
  );
  if (!extracted.ok) return extracted;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("replace_master_resume", {
    p_file_name: file.name.slice(0, 255),
    p_file_type: extracted.fileType,
    p_file_size: file.size,
    p_content: extracted.text,
  });
  if (error) {
    // The code only: the message could echo resume text.
    console.error("master resume not saved", error.code);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/resume", "page");
  revalidatePath("/[locale]/jobs/[id]", "page");
  return { ok: true };
}

export type ActionResult =
  { ok: true } | { ok: false; error: "auth" | "invalid" | "failed" };

/**
 * Deletes the master resume, every stored version of it. Tailored resumes
 * stay (they are separate documents) but are no longer linked to it.
 */
export async function deleteMasterResume(): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("master_resumes")
    .delete()
    .eq("user_id", user.id);
  if (error) {
    console.error("master resume not deleted", error.code);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/resume", "page");
  revalidatePath("/[locale]/jobs/[id]", "page");
  return { ok: true };
}

const saveSchema = z.object({
  id: z.guid(),
  content: storedResumeSchema,
  final: z.boolean(),
});

/**
 * Saves edits to a tailored resume. `final` approves it: it becomes the
 * saved version and the job's tracker card points at it.
 */
export async function saveTailoredResume(
  input: unknown,
): Promise<ActionResult> {
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_tailored_resume", {
    p_id: parsed.data.id,
    p_content: parsed.data.content,
    p_final: parsed.data.final,
  });
  if (error) {
    console.error("tailored resume not saved", error.code);
    return {
      ok: false,
      error: error.message === "not_found" ? "invalid" : "failed",
    };
  }
  revalidatePath("/[locale]/resume", "layout");
  revalidatePath("/[locale]/jobs/[id]", "page");
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true };
}

const idSchema = z.object({ id: z.guid() });

/** Deletes a tailored resume the user doesn't want (Cancel, or Delete). */
export async function deleteTailoredResume(
  input: unknown,
): Promise<ActionResult> {
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "auth" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tailored_resumes")
    .delete()
    .eq("user_id", user.id)
    .eq("id", parsed.data.id);
  if (error) {
    console.error("tailored resume not deleted", error.code);
    return { ok: false, error: "failed" };
  }
  revalidatePath("/[locale]/resume", "layout");
  revalidatePath("/[locale]/jobs/[id]", "page");
  revalidatePath("/[locale]/dashboard", "page");
  return { ok: true };
}
