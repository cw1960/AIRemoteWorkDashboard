"use client";

import { BellRing, KanbanSquare, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { INTRO_COOKIE } from "@/lib/intro";

const STEPS = [
  ["find", Search],
  ["track", KanbanSquare],
  ["remind", BellRing],
] as const;

/**
 * The welcome introduction above the feed for signed-out visitors: what the
 * site does in three steps, and why to sign up. Hiding it sets a cookie so
 * it stays hidden.
 */
export function IntroBand() {
  const t = useTranslations("Intro");
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <section
      aria-labelledby="intro-title"
      className="relative mt-4 rounded-2xl border border-border p-5 glass-panel sm:p-6"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-11"
        aria-label={t("dismiss")}
        onClick={() => {
          document.cookie = `${INTRO_COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
          setHidden(true);
        }}
      >
        <X aria-hidden="true" />
      </Button>
      <p className="text-xs font-bold text-primary uppercase">{t("label")}</p>
      <h2
        id="intro-title"
        className="mt-1 pr-10 font-display text-xl font-extrabold sm:text-2xl"
      >
        {t("title")}
      </h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {STEPS.map(([key, Icon]) => (
          <li
            key={key}
            className="flex gap-3 rounded-xl border border-border bg-card/60 p-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-bold">{t(`steps.${key}.title`)}</span>
              <span className="block text-sm text-muted-foreground">
                {t(`steps.${key}.body`)}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="editorial" size="touch">
          <Link href="/sign-in">{t("signUp")}</Link>
        </Button>
        <Button asChild variant="editorialOutline" size="touch">
          <Link href="/how-it-works">{t("learnMore")}</Link>
        </Button>
      </div>
    </section>
  );
}
