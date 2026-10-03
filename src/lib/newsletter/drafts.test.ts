import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";

import { groupDraftsByRecipient, type UnsentDraft } from "./drafts";

function draft(channel: UnsentDraft["channel"], body: string): UnsentDraft {
  return {
    id: crypto.randomUUID(),
    channel,
    body,
    kind: "weekly",
    issue_date: "2026-10-05",
  };
}

describe("groupDraftsByRecipient", () => {
  it("sends LinkedIn drafts to Amir and the rest to the owner, in channel order", () => {
    const groups = groupDraftsByRecipient([
      draft("video", "Script"),
      draft("linkedin", "Post"),
      draft("x", "Short"),
      draft("reddit", "Thread"),
    ]);
    expect(groups.map((g) => [g.to, g.drafts.map((d) => d.channel)])).toEqual([
      [siteConfig.newsletter.draftsTo.linkedin, ["linkedin"]],
      [siteConfig.newsletter.draftsTo.other, ["x", "reddit", "video"]],
    ]);
  });

  it("sends nothing when there are no drafts", () => {
    expect(groupDraftsByRecipient([])).toEqual([]);
  });

  it("leaves Amir out when there is no LinkedIn draft", () => {
    const groups = groupDraftsByRecipient([draft("x", "Short")]);
    expect(groups.map((g) => g.to)).toEqual([
      siteConfig.newsletter.draftsTo.other,
    ]);
  });
});
