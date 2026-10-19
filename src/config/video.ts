/**
 * Videos hosted on Bunny Stream. The player is loaded only when a visitor
 * clicks play (see HeroVideo), so pages stay fast and nothing reaches Bunny
 * before then.
 */
export const videoConfig = {
  /** The landing page video in the signed-out hero. */
  hero: {
    /** Bunny Stream → the library → API → "Video Library ID". */
    libraryId: "770115",
    videoId: "6a0da391-a079-4c22-af3e-fdfbb1c9ead4",
  },
} as const;

/** Bunny's embeddable player for one video, set to start on load. */
export function bunnyEmbedUrl(libraryId: string, videoId: string): string {
  const url = new URL(
    `https://iframe.mediadelivery.net/embed/${encodeURIComponent(libraryId)}/${encodeURIComponent(videoId)}`,
  );
  url.searchParams.set("autoplay", "true");
  url.searchParams.set("preload", "true");
  url.searchParams.set("responsive", "true");
  return url.toString();
}
