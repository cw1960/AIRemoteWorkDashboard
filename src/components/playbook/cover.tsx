import { cn } from "@/lib/utils";

/**
 * The book's cover, drawn in CSS after the printed design (white "AI",
 * cyan "PLAYBOOK", coral topics) until the cover image is added.
 */
export function PlaybookCover({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "@container relative aspect-[1253/2000] w-full overflow-hidden rounded-lg border border-white/10 bg-[#070718] shadow-2xl shadow-black/60",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,oklch(0.45_0.2_330/0.55),transparent_55%),radial-gradient(ellipse_at_90%_45%,oklch(0.5_0.25_275/0.6),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[18%] -right-[20%] h-[16%] w-[95%] rotate-[38deg] rounded-sm bg-gradient-to-r from-indigo-500/0 via-indigo-500/80 to-blue-500/90 blur-[1px]"
      />
      <div
        aria-hidden="true"
        className="relative flex h-full flex-col px-[7%] pt-[9%] pb-[6%] font-black text-white uppercase"
      >
        <span className="[font-size:clamp(4rem,34cqw,10rem)] leading-none drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]">
          AI
        </span>
        <span className="mt-[4%] [font-size:clamp(1.25rem,9cqw,2.4rem)] leading-none tracking-tight">
          Remote Work
        </span>
        <span className="mt-[2%] [font-size:clamp(1.5rem,11cqw,3rem)] leading-none tracking-tight text-[#12b5ff]">
          Playbook
        </span>
        <span className="mt-auto rounded-md border border-fuchsia-400/50 px-[4%] py-[3%] text-center [font-size:clamp(0.55rem,3.6cqw,1rem)] leading-snug font-extrabold text-[#ff6b6b] normal-case">
          30-day Quick Start · Assessments · Resumes · Zara · Interviews
        </span>
        <span className="mt-[6%] [font-size:clamp(0.6rem,3.8cqw,1rem)] font-extrabold text-[#12b5ff] normal-case">
          Cris Lopez, PhD
        </span>
      </div>
    </div>
  );
}
