import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { signIn, uniqueEmail } from "./helpers";

// supabase/seed.sql makes e2e-admin-<project>@example.com an admin.
test.describe("hand-picked listings", () => {
  test("are hidden from signed-out visitors", async ({ page }) => {
    const response = await page.goto("/admin/listings");
    expect(response?.status()).toBe(404);
  });

  test("are hidden from signed-in users who are not admins", async ({
    page,
    request,
  }, testInfo) => {
    await signIn(page, request, uniqueEmail(testInfo.project.name));
    const response = await page.goto("/admin/listings");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
  });

  test("the editor adds a listing, is told about a repeat, and closes it", async ({
    page,
    request,
  }, testInfo) => {
    const project = testInfo.project.name;
    await signIn(
      page,
      request,
      `e2e-admin-${project}@example.com`,
      "/admin/listings",
    );
    await expect(
      page.getByRole("heading", { level: 1, name: "Hand-picked listings" }),
    ).toBeVisible();
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations).toEqual([]);

    const run = `${project}-${Date.now()}`;
    const title = `E2E Physics Expert ${run}`;
    const form = page.getByRole("form", { name: "Add a listing" });
    async function submit() {
      await form.getByLabel("Company", { exact: true }).selectOption("Outlier");
      await form.getByLabel("Job title").fill(title);
      await form
        .getByLabel("Listing address")
        .fill(`https://example.com/e2e/${run}`);
      await form.getByLabel("Pay from (USD)").fill("40");
      await form.getByLabel("Pay up to (USD)").fill("60");
      await form.getByLabel("Per", { exact: true }).selectOption("hour");
      await form.getByRole("button", { name: "Check and save" }).click();
    }

    // Invalid input names the field.
    await form.getByRole("button", { name: "Check and save" }).click();
    await expect(form.getByRole("alert")).toHaveText(
      "Check the fields marked in red.",
    );
    await expect(form.getByLabel("Job title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    await submit();
    await expect(form.getByRole("status")).toHaveText(
      "Saved as a new listing.",
    );
    const item = page.getByRole("listitem").filter({ hasText: title });
    await expect(item).toContainText("Outlier");
    await expect(item).toContainText("Open");

    await submit();
    await expect(form.getByRole("status")).toHaveText(
      `Not saved: it repeats “${title}”.`,
    );
    await expect(
      page.getByRole("listitem").filter({ hasText: title }),
    ).toHaveCount(1);

    await item.getByRole("button", { name: `Close: ${title}` }).click();
    await expect(item).toContainText("Closed");
  });
});
