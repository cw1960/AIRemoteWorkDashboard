"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { SiteHeader } from "@/components/site-header";
import { StateBlock } from "@/components/state-block";
import { Button } from "@/components/ui/button";

/** Shown when a page's data fails to load; "Try again" re-renders it. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Feed");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6"
      >
        <StateBlock
          icon={CircleAlert}
          tone="error"
          title={t("errorTitle")}
          copy={t("errorBody")}
          action={
            <Button variant="editorial" size="touch" onClick={reset}>
              <RotateCcw />
              {t("retry")}
            </Button>
          }
        />
      </main>
    </>
  );
}
