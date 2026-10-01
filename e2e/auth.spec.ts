import AxeBuilder from "@axe-core/playwright";
import { expect, type APIRequestContext, test } from "@playwright/test";

// Magic-link sign-in against the local Supabase stack. Its emails land in
// Mailpit, whose API the tests read the link from.
const MAILPIT = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

/** The sign-in link from the newest email to `to`, waiting for it. */
async function magicLink(request: APIRequestContext, to: string) {
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

function uniqueEmail(project: string) {
  return `e2e-${project}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe("sign-in", () => {
  test("signs in with a magic link and returns to the page", async ({
    page,
    request,
  }, testInfo) => {
    const email = uniqueEmail(testInfo.project.name);
    await page.goto("/sign-in?next=/platforms/mercor");

    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Email me a link" }).click();
    await expect(page.getByRole("status")).toContainText("Check your email");
    await expect(page.getByRole("status")).toContainText(email);

    await page.goto(await magicLink(request, email));

    await expect(page).toHaveURL(/\/platforms\/mercor$/);
    const signOut = page.getByRole("button", { name: "Sign out" });
    await expect(signOut).toBeVisible();

    await signOut.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("rejects an invalid email", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Email me a link" }).click();

    await expect(page.locator("#sign-in-error")).toContainText(
      "Enter a valid email address",
    );
  });

  test("explains a broken or used link", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=bogus&type=email&next=/");

    await expect(page).toHaveURL(/\/sign-in\?error=link/);
    await expect(page.locator("#sign-in-error")).toContainText(
      "That sign-in link didn't work",
    );
  });

  test("never redirects off-site after signing in", async ({ request }) => {
    const response = await request.get(
      "/auth/confirm?token_hash=bogus&type=email&next=//evil.example",
      { maxRedirects: 0 },
    );
    expect(response.headers().location).toBe("/sign-in?error=link&next=%2F");
  });

  test("shows Sign in in the header when signed out", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });

  test("has no detectable WCAG 2.2 AA violations", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
