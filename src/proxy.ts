import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { refreshSession } from "./lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const applySession = await refreshSession(request);
  return applySession(handleI18nRouting(request));
}

export const config = {
  // Everything except API routes, the /go redirect, the sign-in callback,
  // Next internals and files with an extension (robots.txt, favicon.ico, …).
  matcher: "/((?!api|go/|auth/|_next|_vercel|.*\\..*).*)",
};
