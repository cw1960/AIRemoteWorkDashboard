import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { safeNextPath } from "@/lib/auth/next-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const OTP_TYPES = [
  "email",
  "magiclink",
  "signup",
] as const satisfies readonly EmailOtpType[];

const paramsSchema = z.object({
  token_hash: z.string().min(1).max(500).optional(),
  type: z.enum(OTP_TYPES).optional(),
  code: z.string().min(1).max(500).optional(),
  next: z.string().max(500).optional(),
});

/**
 * Where the magic link lands. Handles both link styles: `token_hash` (works
 * when the email is opened in another browser or app) and `code` (PKCE,
 * Supabase's default email template). Redirects are relative, so they keep
 * the host the visitor used.
 */
export async function GET(request: NextRequest) {
  const parsed = paramsSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  const params = parsed.success ? parsed.data : {};
  const supabase = await createSupabaseServerClient();

  let signedIn = false;
  if (params.token_hash && params.type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: params.type,
    });
    signedIn = !error;
  } else if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    signedIn = !error;
  }

  const location = signedIn
    ? safeNextPath(params.next)
    : `/sign-in?error=link&next=${encodeURIComponent(safeNextPath(params.next))}`;
  return new NextResponse(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "no-store" },
  });
}
