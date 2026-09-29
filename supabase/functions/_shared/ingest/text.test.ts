import { describe, expect, it } from "vitest";

import { toAlpha2 } from "./countries.ts";
import { collect } from "./job.ts";
import { detectLanguages } from "./languages.ts";
import { summarize, toIsoUtc } from "./text.ts";

describe("summarize", () => {
  it("returns the first paragraph as plain text", () => {
    expect(
      summarize("We need **Spanish** [experts](https://x.y).\n\nMore."),
    ).toBe("We need Spanish experts.");
  });

  it("cuts long text at a sentence or word boundary", () => {
    const long = `${"First sentence is here. ".repeat(20)}`;
    const summary = summarize(long, 100) ?? "";
    expect(summary.length).toBeLessThanOrEqual(100);
    expect(summary.endsWith(".")).toBe(true);

    const words = summarize("word ".repeat(100), 50) ?? "";
    expect(words.endsWith("…")).toBe(true);
    expect(words.length).toBeLessThanOrEqual(51);
  });

  it("skips headings and label lines", () => {
    expect(
      summarize(
        "# **Overview**\n\nLocation: Remote\n\nWe're looking for professionals with real-world experience.",
      ),
    ).toBe("We're looking for professionals with real-world experience.");
    expect(
      summarize(
        "**About the role**\n\nWe're hiring bilingual speakers to make AI safer.",
      ),
    ).toBe("We're hiring bilingual speakers to make AI safer.");
  });

  it("returns null for empty input", () => {
    expect(summarize("  \n\n ")).toBeNull();
    expect(summarize(null)).toBeNull();
  });
});

describe("toIsoUtc", () => {
  it("reads source timestamps as UTC", () => {
    expect(toIsoUtc("2026-09-28 19:40:05")).toBe("2026-09-28T19:40:05.000Z");
    expect(toIsoUtc("2026-09-28T19:40:05+02:00")).toBe(
      "2026-09-28T17:40:05.000Z",
    );
    expect(toIsoUtc("not a date")).toBeNull();
  });
});

describe("detectLanguages", () => {
  it("finds capitalised language names only", () => {
    expect(detectLanguages("Polish Translator", "polish your prose")).toEqual([
      "pl",
    ]);
    expect(detectLanguages("Mandarin and Cantonese Reviewer")).toEqual(["zh"]);
    expect(detectLanguages("Java Engineer")).toEqual([]);
  });
});

describe("toAlpha2", () => {
  it("maps known alpha-3 codes and drops unknown ones", () => {
    expect(toAlpha2(["USA", "mex", "XXX", "USA"])).toEqual(["MX", "US"]);
    expect(toAlpha2(null)).toEqual([]);
  });
});

describe("collect", () => {
  const job = {
    external_id: "x",
    title: "T",
    summary: null,
    domain: "other",
    tags: [],
    pay_min: 10,
    pay_max: 20,
    pay_unit: "hour",
    languages: [],
    countries: [],
    countries_blocked: [],
    url: "https://example.com",
    posted_at: null,
  };

  it("skips invalid listings and duplicate ids", () => {
    const result = collect([
      job,
      job,
      { ...job, external_id: "y", url: "http://insecure.example.com" },
      { ...job, external_id: "z", pay_min: 30 },
    ]);
    expect(result.jobs.map((j) => j.external_id)).toEqual(["x"]);
    expect(result.skipped).toBe(3);
  });
});
