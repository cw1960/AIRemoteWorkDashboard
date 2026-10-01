import "server-only";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { render } from "react-email";

import { siteConfig } from "@/config/site";
import { ReminderEmail } from "@/emails/reminder";
import { WelcomeEmail } from "@/emails/welcome";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
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
  reasonKey: "reasonWelcome" | "reasonReminder",
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
