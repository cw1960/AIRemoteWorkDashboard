import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { newsletterDraftsEmail } from "@/lib/email/messages";
import { sendBatch } from "@/lib/email/send";
import {
  groupDraftsByRecipient,
  unsentDraftSchema,
} from "@/lib/newsletter/drafts";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";

const bodySchema = z.object({ runId: z.uuid() });
const tokenSchema = z.string().regex(/^[0-9a-f]{64}$/);

/** Postgres invalid_authorization_specification, raised for a bad token. */
const BAD_TOKEN = "28000";

/**
 * POST /api/newsletter/notify  {"runId": "<uuid>"}, header x-newsletter-token.
 *
 * Called by the newsletter workflow (cw1960/airemoteworktoday) after it
 * saves a run's social drafts. Emails them through Resend, LinkedIn drafts
 * to Amir and the rest to the owner, and marks them sent. The token is
 * checked by the database functions, which hold it in Vault. Without
 * RESEND_API_KEY (previews, local, CI) nothing is sent or marked.
 */
export async function POST(request: NextRequest) {
  const token = tokenSchema.safeParse(
    request.headers.get("x-newsletter-token"),
  );
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!token.success) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!body.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { runId } = body.data;

  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.rpc("newsletter_unsent_drafts", {
    p_token: token.data,
    p_run_id: runId,
  });
  if (error) {
    if (error.code === BAD_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    console.error("newsletter drafts not loaded", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
  const drafts = z.array(unsentDraftSchema).parse(data);
  const first = drafts[0];
  if (!first) {
    return NextResponse.json({ runId, drafts: 0, result: "nothing to send" });
  }

  const emails = await Promise.all(
    groupDraftsByRecipient(drafts).map((group) =>
      newsletterDraftsEmail({
        to: group.to,
        kind: first.kind,
        issueDate: first.issue_date,
        drafts: group.drafts,
      }),
    ),
  );
  const ids = drafts.map((draft) => draft.id);
  const result = await sendBatch(emails, `newsletter-drafts/${ids.join(",")}`);
  if (result === "sent") {
    const marked = await supabase.rpc("newsletter_mark_drafts_emailed", {
      p_token: token.data,
      p_ids: ids,
    });
    if (marked.error) console.error("drafts not marked", marked.error);
  }

  return NextResponse.json(
    { runId, drafts: drafts.length, emails: emails.length, result },
    { status: result === "failed" ? 502 : 200 },
  );
}
