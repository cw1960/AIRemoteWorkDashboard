import { type NextRequest, NextResponse } from "next/server";

import { isPreviewHost, outboundUrl } from "@/lib/jobs/outbound";
import { getOutboundJob, logOutboundClick } from "@/lib/jobs/queries";

/**
 * Every "Apply" click goes through here: log the click, then redirect to the
 * platform, with the referral code where the platform has one. Closed or
 * unknown jobs go back to their job page instead of a dead listing.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[id]">) {
  const { id } = await ctx.params;
  // Validates the id (Zod) and returns null for anything unknown.
  const job = await getOutboundJob(id);

  if (job?.status !== "open") {
    return noStore(
      NextResponse.redirect(
        new URL(`/jobs/${encodeURIComponent(id)}`, request.url),
        303,
      ),
    );
  }

  if (!isPreviewHost(request.headers.get("host"))) {
    try {
      await logOutboundClick(job.id);
    } catch (error) {
      // A failed log must never stop someone from applying.
      console.error("outbound click not logged", error);
    }
  }

  const { url } = outboundUrl({
    url: job.url,
    external_id: job.external_id,
    referral_url_template: job.platform.referral_url_template,
  });
  return noStore(NextResponse.redirect(url, 302));
}

function noStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
