import { expect, test } from "@playwright/test";

test("representative shell has no browser errors or framework overlay", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.addInitScript(() => {
    window.localStorage.setItem("m0az-os:session", JSON.stringify({ version: 1, theme: "phosphor", soundEnabled: false, bootComplete: true, achievements: [], discoveredSecrets: [], commandHistory: [] }));
  });
  await page.goto("/");
  await expect(page.locator("html[data-m0az-ready='true']")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /I build systems people can understand/i })).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });

  const terminal = page.getByLabel("M0AZ_OS terminal command");
  await terminal.fill("ssh m0az-os");
  await terminal.press("Enter");
  await expect(page).toHaveURL(/\/projects\/m0az-os$/);
  await expect(page.getByRole("heading", { name: "M0AZ_OS" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("project-host.png"), fullPage: true });
  expect(consoleErrors).toEqual([]);
});
