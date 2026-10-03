import { z } from "zod";

import { siteConfig } from "@/config/site";

/** Social channels the newsletter workflow drafts for, in display order. */
export const CHANNELS = ["linkedin", "x", "reddit", "video"] as const;
export type Channel = (typeof CHANNELS)[number];

/** A draft not yet emailed, as newsletter_unsent_drafts() returns it. */
export const unsentDraftSchema = z.object({
  id: z.uuid(),
  channel: z.enum(CHANNELS),
  body: z.string().min(1),
  kind: z.enum(["daily", "weekly"]),
  issue_date: z.iso.date(),
});
export type UnsentDraft = z.infer<typeof unsentDraftSchema>;

/**
 * Who posts a channel's drafts (the newsletter repo's docs/distribution.md):
 * LinkedIn is Amir's, everything else the owner's.
 */
export function draftRecipient(channel: Channel): string {
  return channel === "linkedin"
    ? siteConfig.newsletter.draftsTo.linkedin
    : siteConfig.newsletter.draftsTo.other;
}

/** One email's worth of drafts per recipient, each in channel order. */
export function groupDraftsByRecipient(
  drafts: readonly UnsentDraft[],
): { to: string; drafts: UnsentDraft[] }[] {
  const sorted = [...drafts].sort(
    (a, b) => CHANNELS.indexOf(a.channel) - CHANNELS.indexOf(b.channel),
  );
  const groups = new Map<string, UnsentDraft[]>();
  for (const draft of sorted) {
    const to = draftRecipient(draft.channel);
    groups.set(to, [...(groups.get(to) ?? []), draft]);
  }
  return [...groups].map(([to, group]) => ({ to, drafts: group }));
}
