import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(
    "https://api.wheretheiss.at/v1/satellites/25544",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          latitude: 12.3456,
          longitude: 78.9012,
          timestamp: 1_710_000_000,
        }),
      });
    }
  );
});

test("renders tracking interface and updates coordinates", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /international space station tracker/i })
  ).toBeVisible();
  await expect(page.locator("#latitude")).toHaveText("12.3456");
  await expect(page.locator("#longitude")).toHaveText("78.9012");
  await expect(page.locator("#data-status")).toHaveText("synced");
});

test("toggles follow ISS control", async ({ page }) => {
  await page.goto("/");

  const followToggle = page.locator("#followToggle");
  await expect(followToggle).toHaveAttribute("aria-pressed", "true");

  await followToggle.click();
  await expect(followToggle).toHaveAttribute("aria-pressed", "false");
  await expect(followToggle).toContainText("Follow ISS: Off");
});
