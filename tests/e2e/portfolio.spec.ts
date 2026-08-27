import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("m0az-os:session", JSON.stringify({ version: 1, theme: "phosphor", soundEnabled: false, bootComplete: true, achievements: [], discoveredSecrets: [], commandHistory: [] }));
  });
});

test("click navigation opens projects with a shareable URL", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /projects/i }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible();
});

test("terminal navigation uses the same project module", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("M0AZ_OS terminal command");
  await input.fill("projects");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible();
});

test("ssh mounts a project host and back restores portfolio", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("M0AZ_OS terminal command");
  await input.fill("ssh m0az-os");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects\/m0az-os$/);
  await expect(page.getByText("moaz@m0az-os:", { exact: false }).last()).toBeVisible();
  await input.fill("back");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);
});
