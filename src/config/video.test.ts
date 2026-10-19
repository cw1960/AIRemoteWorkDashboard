import { describe, expect, it } from "vitest";

import { bunnyEmbedUrl } from "./video";

describe("bunnyEmbedUrl", () => {
  it("points at Bunny's player for the library and video", () => {
    expect(bunnyEmbedUrl("770115", "abc-123")).toBe(
      "https://iframe.mediadelivery.net/embed/770115/abc-123?autoplay=true&preload=true&responsive=true",
    );
  });

  it("keeps odd input inside the path", () => {
    expect(bunnyEmbedUrl("1/../2", "a?b")).toBe(
      "https://iframe.mediadelivery.net/embed/1%2F..%2F2/a%3Fb?autoplay=true&preload=true&responsive=true",
    );
  });
});
