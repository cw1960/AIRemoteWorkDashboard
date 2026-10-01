import { type APIRequestContext, expect, type Page } from "@playwright/test";

// Magic-link sign-in against the local Supabase stack. Its emails land in
// Mailpit, whose API the tests read the link from.
const MAILPIT = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

export function uniqueEmail(project: string): string {
  return `e2e-${project}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

/** The sign-in link from the newest email to `to`, waiting for it. */
export async function magicLink(
  request: APIRequestContext,
  to: string,
): Promise<string> {
  let link: string | undefined;
  await expect
    .poll(
      async () => {
        const search = await request.get(`${MAILPIT}/api/v1/search`, {
          params: { query: `to:"${to}"` },
        });
        const { messages } = (await search.json()) as {
          messages: { ID: string }[];
        };
        const id = messages[0]?.ID;
        if (!id) return undefined;
        const message = await request.get(`${MAILPIT}/api/v1/message/${id}`);
        const { HTML } = (await message.json()) as { HTML: string };
        link = /href="([^"]+)"/.exec(HTML)?.[1]?.replaceAll("&amp;", "&");
        return link;
      },
      { timeout: 15_000 },
    )
    .toBeTruthy();
  return link ?? "";
}

/** Requests a magic link from /sign-in and follows it. */
export async function signIn(
  page: Page,
  request: APIRequestContext,
  email: string,
  next = "/",
): Promise<void> {
  await page.goto(`/sign-in?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Email me a link" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");
  await page.goto(await magicLink(request, email));
}
