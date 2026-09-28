import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the /go redirect, Next internals and
  // files with an extension (robots.txt, favicon.ico, …).
  matcher: "/((?!api|go|_next|_vercel|.*\\..*).*)",
};
