import { LogOut } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/actions";
import { getSessionUser } from "@/lib/auth/session";

/** Header account area: "Sign in", or the signed-in email and "Sign out". */
export async function AccountNav() {
  const [t, user] = await Promise.all([
    getTranslations("Auth"),
    getSessionUser(),
  ]);

  if (!user) {
    return (
      <Button asChild variant="editorial" size="touch">
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  return (
    <>
      <span className="hidden max-w-[16rem] truncate text-sm text-muted-foreground sm:inline">
        {user.email}
      </span>
      <form action={signOut}>
        <Button type="submit" variant="editorialOutline" size="touch">
          <LogOut aria-hidden="true" />
          {t("signOut")}
        </Button>
      </form>
    </>
  );
}
