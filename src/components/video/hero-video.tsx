"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { bunnyEmbedUrl } from "@/config/video";
import { cn } from "@/lib/utils";

/**
 * A Bunny Stream video behind a click-to-play poster: the player (and any
 * request to Bunny) loads only after the visitor presses play.
 */
export function HeroVideo({
  libraryId,
  videoId,
  className,
}: {
  libraryId: string;
  videoId: string;
  className?: string;
}) {
  const t = useTranslations("Intro.video");
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-2xl shadow-primary/10",
        className,
      )}
    >
      {playing ? (
        <iframe
          src={bunnyEmbedUrl(libraryId, videoId)}
          title={t("title")}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
          }}
          className="group absolute inset-0 grid place-items-center bg-linear-to-br from-primary/30 via-card to-background focus-visible:outline-none"
        >
          <span className="flex flex-col items-center gap-3">
            <span className="grid size-18 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-ring motion-reduce:transition-none">
              <Play className="ml-1 size-8 fill-current" aria-hidden="true" />
            </span>
            <span className="rounded-full bg-background/70 px-3 py-1 text-sm font-semibold backdrop-blur">
              {t("play")}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
