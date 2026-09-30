import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-lg font-extrabold text-primary-foreground gradient-primary"
            aria-hidden="true"
          >
            {siteConfig.name.charAt(0)}
          </span>
          <span className="truncate font-extrabold">{siteConfig.name}</span>
        </Link>
      </div>
    </header>
  );
}
