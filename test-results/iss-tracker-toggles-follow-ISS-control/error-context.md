# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: iss-tracker.spec.js >> toggles follow ISS control
- Location: tests/smoke/iss-tracker.spec.js:31:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#followToggle')
Expected: "false"
Received: "true"
Timeout:  10000ms

Call log:
  - Expect "toHaveAttribute" locator('#followToggle') with timeout 10000ms
  - waiting for locator('#followToggle')
    23 × locator resolved to <button type="button" id="followToggle" aria-pressed="true" aria-label="Toggle map following ISS position">↵          Follow ISS: On↵        </button>
       - unexpected value "true"

```

```yaml
- button "Toggle map following ISS position" [pressed]: "Follow ISS: On"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test.beforeEach(async ({ page }) => {
  4  |   await page.route(
  5  |     "https://api.wheretheiss.at/v1/satellites/25544",
  6  |     async (route) => {
  7  |       await route.fulfill({
  8  |         status: 200,
  9  |         contentType: "application/json",
  10 |         body: JSON.stringify({
  11 |           latitude: 12.3456,
  12 |           longitude: 78.9012,
  13 |           timestamp: 1_710_000_000,
  14 |         }),
  15 |       });
  16 |     }
  17 |   );
  18 | });
  19 | 
  20 | test("renders tracking interface and updates coordinates", async ({ page }) => {
  21 |   await page.goto("/");
  22 | 
  23 |   await expect(
  24 |     page.getByRole("heading", { name: /international space station tracker/i })
  25 |   ).toBeVisible();
  26 |   await expect(page.locator("#latitude")).toHaveText("12.3456");
  27 |   await expect(page.locator("#longitude")).toHaveText("78.9012");
  28 |   await expect(page.locator("#data-status")).toHaveText("synced");
  29 | });
  30 | 
  31 | test("toggles follow ISS control", async ({ page }) => {
  32 |   await page.goto("/");
  33 | 
  34 |   const followToggle = page.locator("#followToggle");
  35 |   await expect(followToggle).toHaveAttribute("aria-pressed", "true");
  36 | 
  37 |   await followToggle.click();
> 38 |   await expect(followToggle).toHaveAttribute("aria-pressed", "false");
     |                              ^ Error: expect(locator).toHaveAttribute(expected) failed
  39 |   await expect(followToggle).toContainText("Follow ISS: Off");
  40 | });
  41 | 
```