import { NextResponse, type NextRequest } from "next/server";

import { playbookPath } from "@/lib/playbook/paths";
import { checkoutEnabled, createCheckoutSession } from "@/lib/playbook/stripe";

/**
 * POST /api/playbook/checkout — the sales page's buy buttons (plain form
 * posts, so they work without JavaScript). Sends the buyer to Stripe
 * Checkout, or back to the page with a reason when it can't.
 */
export async function POST(request: NextRequest) {
  const back = (reason: string) =>
    NextResponse.redirect(
      new URL(
        `${playbookPath(request.headers.get("host"))}?checkout=${reason}#buy`,
        request.url,
      ),
      303,
    );
  if (!checkoutEnabled()) return back("unavailable");
  try {
    return NextResponse.redirect(await createCheckoutSession(), 303);
  } catch (error) {
    console.error("playbook checkout failed", error);
    return back("error");
  }
}
