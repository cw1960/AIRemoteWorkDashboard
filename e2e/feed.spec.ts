import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Runs against the local Supabase stack seeded with supabase/seed.sql
// (26 sample jobs, 24 open).

const heading = "#results-heading";

test.describe("job feed", () => {
  test("lists open jobs on the home page", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Remote AI training jobs" }),
    ).toBeVisible();
    await expect(page.locator(heading)).toHaveText("24 open jobs");
    await expect(
      page.getByRole("list", { name: "Job results" }).getByRole("listitem"),
    ).toHaveCount(24);
  });

  test("filters from the URL, which can be shared", async ({ page }) => {
    await page.goto("/?domain=law&sort=pay");

    await expect(page.locator(heading)).toHaveText("3 open jobs");
    // Auto-retrying assertion: waits for the three cards, highest pay first.
    await expect(
      page
        .getByRole("list", { name: "Job results" })
        .locator("article p.text-lg"),
    ).toHaveText(["$30–90 / hr", "$40–50 / hr", "$50 / hr"]);
  });

  test("searches titles", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("searchbox", { name: "Search jobs" })
      .fill("translator");
    await page.getByRole("button", { name: "Search", exact: true }).click();

    await expect(page).toHaveURL(/[?&]q=translator(&|$)/);
    await expect(page.locator(heading)).toHaveText("1 open job");
  });

  test("shows an empty state with a way back", async ({ page }) => {
    await page.goto("/?q=zzz-no-such-job");

    await expect(page.getByText("No jobs match these filters.")).toBeVisible();
    await page.getByRole("link", { name: "Clear filters" }).click();
    await expect(page.locator(heading)).toHaveText("24 open jobs");
  });

  test("ignores invalid filter values", async ({ page }) => {
    const response = await page.goto("/?domain=astrology&minPay=-1&page=abc");

    expect(response?.status()).toBe(200);
    await expect(page.locator(heading)).toHaveText("24 open jobs");
  });

  test("filters on a phone through the Filters sheet", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "The sheet is the phone layout.");
    await page.goto("/");

    await page.getByRole("button", { name: /Filters/ }).click();
    const sheet = page.getByRole("dialog", { name: "Filters" });
    await sheet.getByText("Law", { exact: true }).click();
    await sheet.getByRole("button", { name: "Show jobs" }).click();

    await expect(page).toHaveURL(/\?domain=law$/);
    await expect(page.locator(heading)).toHaveText("3 open jobs");
    await expect(page.getByRole("button", { name: /1 active/ })).toBeVisible();
  });

  test("has no detectable WCAG 2.2 AA violations", async ({ page }) => {
    await page.goto("/?domain=law");
    await expect(page.locator(heading)).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
