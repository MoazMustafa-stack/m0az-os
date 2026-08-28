import { expect, test } from "@playwright/test";

test("recruiter-first pages have no browser errors or framework overlay", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.addInitScript(() => {
    window.localStorage.setItem("m0az-os:session", JSON.stringify({ version: 1, theme: "phosphor", soundEnabled: false, bootComplete: true, achievements: [], discoveredSecrets: [], commandHistory: [] }));
  });
  const pages = [
    { path: "/", name: "home", heading: /Software engineer building reliable product systems/i },
    { path: "/projects", name: "work", heading: /work/i },
    { path: "/experience", name: "experience", heading: /experience/i },
    { path: "/skills", name: "skills", heading: /skills & capabilities/i },
    { path: "/contact", name: "contact", heading: /contact/i },
  ];
  for (const target of pages) {
    await page.goto(target.path);
    await expect(page.locator("html[data-m0az-ready='true']")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();
    await expect(page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")).toHaveCount(0);
    await page.screenshot({ path: testInfo.outputPath(`${target.name}.png`), fullPage: true });
  }
  await page.goto("/projects");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.screenshot({ path: testInfo.outputPath("work-light.png"), fullPage: true });

  await page.evaluate(() => window.localStorage.removeItem("m0az-os:session"));
  await page.addInitScript(() => window.localStorage.removeItem("m0az-os:session"));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Initialize the site." })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("boot.png"), fullPage: true });
  expect(consoleErrors).toEqual([]);
});
