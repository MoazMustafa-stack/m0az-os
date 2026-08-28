import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!window.sessionStorage.getItem("m0az:test-first-visit")) window.localStorage.setItem("m0az-os:session", JSON.stringify({ version: 1, theme: "phosphor", soundEnabled: false, bootComplete: true, achievements: [], discoveredSecrets: [], commandHistory: [] }));
  });
});

test("first visit requires a typed initialization command", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { window.sessionStorage.setItem("m0az:test-first-visit", "true"); window.localStorage.removeItem("m0az-os:session"); });
  await page.addInitScript(() => window.localStorage.removeItem("m0az-os:session"));
  await page.reload();
  const bootInput = page.getByLabel("visitor@portfolio:~$");
  await expect(bootInput).toBeFocused();
  await bootInput.fill("wrong");
  await bootInput.press("Enter");
  await expect(page.getByText(/not recognized/i)).toBeVisible();
  await bootInput.fill("start");
  await bootInput.press("Enter");
  await expect(page.getByText("Session compiled. Mounting interface…")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Software engineer building reliable product systems/i })).toBeVisible({ timeout: 5_000 });
});

test("five-item navigation opens Work with a shareable URL", async ({ page }) => {
  await page.goto("/");
  const primary = page.locator(".system-nav .nav-item");
  await expect(primary).toHaveCount(5);
  await page.getByRole("button", { name: /^work$/i }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: /work/i })).toBeVisible();
  await page.goto("/projects/lahmah-cuts");
  await expect(page.getByRole("heading", { name: "Lahmah Cuts" })).toBeVisible();
  await expect(page.getByText(/More than 260 automated tests cover/)).toBeVisible();
  await page.goto("/projects/interface-protocols");
  await expect(page).toHaveURL(/\/projects\/velora$/);
  await expect(page.getByRole("heading", { name: "Velora" })).toBeVisible();
});

test("terminal navigation uses the same project module", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("M0AZ_OS terminal command");
  await input.fill("work");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: /work/i })).toBeVisible();
});

test("recruiter flow reaches experience and the resume download", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "REVIEW EXPERIENCE" }).click();
  await expect(page).toHaveURL(/\/experience$/);
  await expect(page.getByText("Cordis.us — Software Engineering Intern")).toBeVisible();
  await expect(page.getByRole("link", { name: "DOWNLOAD PDF" })).toHaveAttribute("href", "/moaz-mustafa-resume.pdf");
});

test("freelance flow reaches services and a prefilled email", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "EXPLORE SERVICES" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { name: "Three ways to work together." })).toBeVisible();
  await expect(page.getByRole("link", { name: "DISCUSS A PROJECT" })).toHaveAttribute("href", /subject=Freelance%20project%20inquiry/);
});

test("mobile primary navigation fits without horizontal scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experience");
  const nav = page.locator(".system-nav");
  await expect(nav.locator(".nav-item")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "EXPERIENCE" })).toHaveAttribute("aria-current", "page");
  expect(await nav.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  const workspace = page.locator(".workspace");
  expect(await workspace.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await workspace.evaluate((element) => { element.style.scrollBehavior = "auto"; element.scrollTop = element.scrollHeight; });
  expect(await workspace.evaluate((element) => element.scrollTop > 0)).toBe(true);
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator(".os-viewport")).toHaveAttribute("data-theme", "light");
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
