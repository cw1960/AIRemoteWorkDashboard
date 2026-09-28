import { describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/config/site";

import { getPublicEnv, getSiteUrl } from "./env";

describe("getPublicEnv", () => {
  it("returns validated public variables", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    expect(getPublicEnv()).toMatchObject({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });
  });

  it("rejects a missing anon key", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    expect(() => getPublicEnv()).toThrow();
  });

  it("rejects a malformed Supabase URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "not a url");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    expect(() => getPublicEnv()).toThrow();
  });
});

describe("getSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com");
    expect(getSiteUrl().origin).toBe("https://preview.example.com");
  });

  it("falls back to the configured site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl().href).toBe(new URL(siteConfig.url).href);
  });

  it("rejects a malformed URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "nope");
    expect(() => getSiteUrl()).toThrow();
  });
});
