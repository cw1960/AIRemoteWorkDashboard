import { Mail, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { AccountNav } from "@/components/account-nav";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { formatPayAmount } from "@/lib/jobs/format";
import { getMatchedJobs, profileCanMatch } from "@/lib/matching/queries";
import { getPassport } from "@/lib/passport/queries";
import { needsOnboarding } from "@/lib/profile/queries";
import { dueView } from "@/lib/tracker/dates";
import { type BoardCard, getBoard } from "@/lib/tracker/queries";

import { Board, type BoardCardView } from "./board";
import { MatchedJobs } from "./matched-jobs";
import { PlatformPassport } from "./platform-passport";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");
  return { title: t("metaTitle"), robots: { index: false } };
}

/** The signed-in user's dashboard: Platform Passport, matched jobs and the pipeline board. */
export default async function DashboardPage() {
  const [locale, user] = await Promise.all([getLocale(), getSessionUser()]);
  if (!user) {
    redirect({ href: "/sign-in?next=%2Fdashboard", locale });
    return null;
  }

  const [t, tJob, cards, onboarding, matches, canMatch, passport] =
    await Promise.all([
      getTranslations("Dashboard"),
      getTranslations("Job"),
      getBoard(),
      needsOnboarding(user.id),
      getMatchedJobs(6),
      profileCanMatch(),
      getPassport(),
    ]);
  const views = boardViews(cards ?? [], locale, (amount, unit) =>
    tJob("pay", { amount, unit }),
  );
  const today = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date());

  return (
    <>
      <SiteHeader>
        <AccountNav />
      </SiteHeader>
      <main
        id="main"
        className="mx-auto w-full max-w-[1600px] flex-1 px-4 pt-7 pb-16 sm:px-6 lg:px-8"
      >
        <p className="text-xs font-bold text-primary uppercase">{today}</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
          {t("title")}
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-muted-foreground">{t("subtitle")}</p>
          <Button asChild variant="editorialLink" size="touch" className="px-0">
            <Link href="/settings">
              <Mail aria-hidden="true" />
              {t("emailSettings")}
            </Link>
          </Button>
        </div>

        {/* Without a field or language, Matched jobs asks for them instead. */}
        {onboarding && canMatch && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/10 p-5">
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold">{t("completeProfile")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("completeProfileBody")}
                </p>
              </div>
            </div>
            <Button asChild variant="editorial" size="touch">
              <Link href="/onboarding?next=%2Fdashboard">
                {t("completeProfile")}
              </Link>
            </Button>
          </div>
        )}

        <PlatformPassport
          entries={passport}
          today={new Date().toISOString().slice(0, 10)}
        />

        <MatchedJobs matches={matches} canMatch={canMatch === true} />

        <Board initialCards={views} />
      </main>
    </>
  );
}

/**
 * Labels computed on the server so server and browser render the same text:
 * pay, the follow-up date and whether it is overdue.
 */
function boardViews(
  cards: BoardCard[],
  locale: string,
  payLabel: (amount: string, unit: string) => string,
): BoardCardView[] {
  const now = Date.now();
  return cards.map((card) => {
    const amount = card.job
      ? formatPayAmount(card.job.payMin, card.job.payMax, locale)
      : null;
    return {
      ...card,
      payLabel:
        amount && card.job
          ? payLabel(amount, card.job.payUnit ?? "other")
          : null,
      ...dueView(card.nextActionAt, locale, now),
    };
  });
}
