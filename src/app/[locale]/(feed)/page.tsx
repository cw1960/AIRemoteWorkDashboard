import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { FeedForm } from "@/components/jobs/feed-form";
import { JobCard } from "@/components/jobs/job-card";
import { SiteHeader } from "@/components/site-header";
import { StateBlock } from "@/components/state-block";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  activeFilterCount,
  PAGE_SIZE,
  parseFeedFilters,
  toSearchParams,
} from "@/lib/jobs/filters";
import { buildFilterOptions } from "@/lib/jobs/options";
import { getFeedFacets, searchJobs } from "@/lib/jobs/queries";

/** The public job feed: server-rendered, filters in the URL. */
export default async function FeedPage({
  searchParams,
}: PageProps<"/[locale]">) {
  const filters = parseFeedFilters(await searchParams);
  const [t, locale, { jobs, total }, facets] = await Promise.all([
    getTranslations("Feed"),
    getLocale(),
    searchJobs(filters),
    getFeedFacets(),
  ]);
  const activeCount = activeFilterCount(filters);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (page: number) => {
    const query = toSearchParams(filters, { page }).toString();
    return query ? `/?${query}` : "/";
  };

  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-16 sm:px-6 lg:px-8"
      >
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
          {t("title")}
        </h1>

        <FeedForm
          filters={filters}
          options={buildFilterOptions(facets, locale)}
          activeCount={activeCount}
        >
          <section aria-labelledby="results-heading">
            <p
              id="results-heading"
              className="text-sm font-semibold"
              aria-live="polite"
            >
              {t("count", { count: total })}
            </p>

            <div className="mt-4">
              {jobs.length === 0 ? (
                <StateBlock
                  icon={Search}
                  title={t("emptyTitle")}
                  copy={t("emptyBody")}
                  action={
                    <Button asChild variant="editorial" size="touch">
                      <Link href="/">{t("clearFilters")}</Link>
                    </Button>
                  }
                />
              ) : (
                <ul className="grid gap-3" aria-label={t("results")}>
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <JobCard job={job} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {pages > 1 && (
              <nav
                aria-label={t("pagination")}
                className="mt-6 flex items-center justify-between gap-3"
              >
                {filters.page > 1 ? (
                  <Button asChild variant="editorialOutline" size="touch">
                    <Link href={pageHref(filters.page - 1)} rel="prev">
                      <ChevronLeft />
                      {t("previous")}
                    </Link>
                  </Button>
                ) : (
                  <span />
                )}
                <p className="text-sm text-muted-foreground">
                  {t("pageOf", { page: filters.page, pages })}
                </p>
                {filters.page < pages ? (
                  <Button asChild variant="editorialOutline" size="touch">
                    <Link href={pageHref(filters.page + 1)} rel="next">
                      {t("next")}
                      <ChevronRight />
                    </Link>
                  </Button>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </section>
        </FeedForm>
      </main>
    </>
  );
}
