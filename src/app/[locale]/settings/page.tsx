import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { AccountNav } from "@/components/account-nav";
import { EmailPrefsForm } from "@/components/email-prefs-form";
import { SiteHeader } from "@/components/site-header";
import { redirect } from "@/i18n/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { updateMyEmailPrefs } from "@/lib/email/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("EmailSettings");
  return { title: t("metaTitle"), robots: { index: false } };
}

/** Signed-in email settings. */
export default async function SettingsPage() {
  const [locale, user] = await Promise.all([getLocale(), getSessionUser()]);
  if (!user) {
    redirect({ href: "/sign-in?next=%2Fsettings", locale });
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [t, { data, error }] = await Promise.all([
    getTranslations("EmailSettings"),
    supabase
      .from("email_prefs")
      .select("alerts_on, reminders_on, recap_on")
      .eq("user_id", user.id)
      .single(),
  ]);
  if (error) throw new Error(error.message);

  return (
    <>
      <SiteHeader>
        <AccountNav />
      </SiteHeader>
      <main id="main" className="mx-auto w-full max-w-xl flex-1 px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("subtitle", { email: user.email ?? "" })}
        </p>
        <div className="mt-8">
          <EmailPrefsForm initial={data} save={updateMyEmailPrefs} />
        </div>
      </main>
    </>
  );
}
