import "server-only";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { render } from "react-email";

import { siteConfig } from "@/config/site";
import { type AlertSearch, JobAlertEmail } from "@/emails/job-alert";
import { RecapEmail } from "@/emails/recap";
import { ReminderEmail } from "@/emails/reminder";
import { WelcomeEmail } from "@/emails/welcome";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { formatPayAmount } from "@/lib/jobs/format";
import { type Stage, STAGES } from "@/lib/tracker/stages";

import type { EmailList } from "./prefs";
import type { OutgoingEmail } from "./send";

type Locale = (typeof routing.locales)[number];

/** A supported locale for an email; unknown values get the default. */
export function emailLocale(locale: string | null | undefined): Locale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/** An absolute link to an app page, with the locale prefix if needed. */
export function appUrl(path: string, locale: string): string {
  const prefixed =
    locale === routing.defaultLocale ? path : `/${locale}${path}`;
  return new URL(prefixed, getSiteUrl()).toString();
}

/** The page where a token holder manages (or stops) their emails. */
export function unsubscribePageUrl(token: string, locale: string): string {
  return appUrl(`/unsubscribe?token=${encodeURIComponent(token)}`, locale);
}

/** The RFC 8058 one-click endpoint mail apps POST to. */
export function oneClickUnsubscribeUrl(token: string, list: EmailList): string {
  const url = new URL("/api/unsubscribe", getSiteUrl());
  url.searchParams.set("token", token);
  url.searchParams.set("list", list);
  return url.toString();
}

async function footer(
  locale: Locale,
  unsubscribeToken: string,
  reasonKey: "reasonWelcome" | "reasonReminder" | "reasonAlert" | "reasonRecap",
) {
  const t = await getTranslations({ locale, namespace: "Emails" });
  return {
    reason: t(reasonKey, { name: siteConfig.name }),
    unsubscribeLabel: t("unsubscribe"),
    unsubscribeUrl: unsubscribePageUrl(unsubscribeToken, locale),
    settingsLabel: t("settings"),
    settingsUrl: appUrl("/settings", locale),
  };
}

export async function welcomeEmail(input: {
  to: string;
  locale: string | null;
  unsubscribeToken: string;
}): Promise<OutgoingEmail> {
  const locale = emailLocale(input.locale);
  const t = await getTranslations({ locale, namespace: "Emails.welcome" });
  const element = (
    <WelcomeEmail
      lang={locale}
      brand={siteConfig.name}
      preview={t("preview")}
      heading={t("heading")}
      body={t("body")}
      tip={t("tip")}
      cta={t("cta")}
      dashboardUrl={appUrl("/dashboard", locale)}
      footer={await footer(locale, input.unsubscribeToken, "reasonWelcome")}
    />
  );
  return {
    to: input.to,
    subject: t("subject", { name: siteConfig.name }),
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
}

export interface DueCard {
  title: string;
  stage: string;
  platform: string | null;
}

export async function reminderEmail(input: {
  to: string;
  locale: string | null;
  unsubscribeToken: string;
  cards: DueCard[];
}): Promise<OutgoingEmail> {
  const locale = emailLocale(input.locale);
  const [t, tStages] = await Promise.all([
    getTranslations({ locale, namespace: "Emails.reminder" }),
    getTranslations({ locale, namespace: "Dashboard.stages" }),
  ]);
  const count = input.cards.length;
  const element = (
    <ReminderEmail
      lang={locale}
      brand={siteConfig.name}
      preview={t("preview", { count })}
      heading={t("heading")}
      intro={t("intro", { count })}
      cards={input.cards.map((card) => ({
        title: card.title,
        detail: [
          (STAGES as readonly string[]).includes(card.stage)
            ? tStages(card.stage as Stage)
            : null,
          card.platform,
        ]
          .filter(Boolean)
          .join(" · "),
      }))}
      cta={t("cta")}
      dashboardUrl={appUrl("/dashboard", locale)}
      footer={await footer(locale, input.unsubscribeToken, "reasonReminder")}
    />
  );
  return {
    to: input.to,
    subject: t("subject", { count }),
    html: await render(element),
    text: await render(element, { plainText: true }),
    unsubscribeUrl: oneClickUnsubscribeUrl(input.unsubscribeToken, "reminders"),
  };
}

export interface AlertSearchInput {
  description: string;
  frequency: "daily" | "weekly";
  /** The feed query for this search (no sort or page). */
  feedQuery: string;
  total: number;
  jobs: {
    id: string;
    title: string;
    platform: string;
    pay_min: number | null;
    pay_max: number | null;
    pay_unit: string | null;
  }[];
}

export async function jobAlertEmail(input: {
  to: string;
  locale: string | null;
  unsubscribeToken: string;
  searches: AlertSearchInput[];
}): Promise<OutgoingEmail> {
  const locale = emailLocale(input.locale);
  const [t, tJob] = await Promise.all([
    getTranslations({ locale, namespace: "Emails.alert" }),
    getTranslations({ locale, namespace: "Job" }),
  ]);
  const total = input.searches.reduce((sum, s) => sum + s.total, 0);
  const searches: AlertSearch[] = input.searches.map((search) => {
    const seeAllParams = new URLSearchParams(search.feedQuery);
    seeAllParams.set("posted", search.frequency === "daily" ? "1d" : "7d");
    return {
      description: search.description,
      countLabel: t("count", { count: search.total }),
      jobs: search.jobs.map((job) => {
        const amount = formatPayAmount(job.pay_min, job.pay_max, locale);
        return {
          title: job.title,
          detail: [
            job.platform,
            amount
              ? tJob("pay", { amount, unit: job.pay_unit ?? "other" })
              : null,
          ]
            .filter(Boolean)
            .join(" · "),
          url: appUrl(`/jobs/${job.id}`, locale),
        };
      }),
      seeAll:
        search.total > search.jobs.length
          ? {
              label: t("seeAll", { count: search.total }),
              url: appUrl(`/?${seeAllParams.toString()}`, locale),
            }
          : null,
    };
  });
  const element = (
    <JobAlertEmail
      lang={locale}
      brand={siteConfig.name}
      preview={t("preview", { count: total })}
      heading={t("heading", { count: total })}
      intro={t("intro")}
      searches={searches}
      footer={await footer(locale, input.unsubscribeToken, "reasonAlert")}
    />
  );
  return {
    to: input.to,
    subject: t("subject", { count: total }),
    html: await render(element),
    text: await render(element, { plainText: true }),
    unsubscribeUrl: oneClickUnsubscribeUrl(input.unsubscribeToken, "alerts"),
  };
}

export interface RecapInput {
  applied: number;
  responses: number;
  moves: number;
  matches: {
    id: string;
    title: string;
    platform: string;
    pay_min: number | null;
    pay_max: number | null;
    pay_unit: string | null;
  }[];
}

export async function recapEmail(input: {
  to: string;
  locale: string | null;
  unsubscribeToken: string;
  recap: RecapInput;
}): Promise<OutgoingEmail> {
  const locale = emailLocale(input.locale);
  const [t, tJob] = await Promise.all([
    getTranslations({ locale, namespace: "Emails.recap" }),
    getTranslations({ locale, namespace: "Job" }),
  ]);
  const { applied, responses, moves, matches } = input.recap;
  const element = (
    <RecapEmail
      lang={locale}
      brand={siteConfig.name}
      preview={t("preview", { matches: matches.length })}
      heading={t("heading")}
      intro={t("intro")}
      stats={[
        { value: String(applied), label: t("applied", { count: applied }) },
        {
          value: String(responses),
          label: t("responses", { count: responses }),
        },
        { value: String(moves), label: t("moves", { count: moves }) },
      ]}
      matchesHeading={t("matchesHeading")}
      matches={matches.map((job) => {
        const amount = formatPayAmount(job.pay_min, job.pay_max, locale);
        return {
          title: job.title,
          detail: [
            job.platform,
            amount
              ? tJob("pay", { amount, unit: job.pay_unit ?? "other" })
              : null,
          ]
            .filter(Boolean)
            .join(" · "),
          url: appUrl(`/jobs/${job.id}`, locale),
        };
      })}
      cta={t("cta")}
      dashboardUrl={appUrl("/dashboard", locale)}
      footer={await footer(locale, input.unsubscribeToken, "reasonRecap")}
    />
  );
  return {
    to: input.to,
    subject: t("subject", { applied, responses }),
    html: await render(element),
    text: await render(element, { plainText: true }),
    unsubscribeUrl: oneClickUnsubscribeUrl(input.unsubscribeToken, "recap"),
  };
}
