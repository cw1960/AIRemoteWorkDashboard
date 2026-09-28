import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <main
      id="main"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16"
    >
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {t("title")}
      </h1>
      <p className="max-w-prose text-lg text-pretty text-muted-foreground">
        {t("lead")}
      </p>
    </main>
  );
}
