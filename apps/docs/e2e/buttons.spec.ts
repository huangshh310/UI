/**
 * Buttons 分类各组件在真实浏览器中的行为规约。
 * 每个组件在自己的详情页主面板里检查它最核心的那一个交互，并做一次 axe 扫描。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { waitForEntranceAnimations } from "./support/animations";

const SLUGS = [
  "press-button",
  "liquid-ripple-button",
  "neon-edge-button",
  "book-call-button",
  "typewriter-button",
  "split-button",
];

/** 打开组件详情页，返回主面板 */
const openMain = async (page: Page, slug: string): Promise<Locator> => {
  await page.goto(`/components/${slug}`);
  return page.getByTestId("component-main");
};

const computed = (locator: Locator, property: string) =>
  locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);

test("Press Button：按住时缩小，松开后恢复", async ({ page }) => {
  const main = await openMain(page, "press-button");
  const button = main.locator('[data-slot="press-button"]').first();
  const box = (await button.boundingBox())!;

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => Number(await computed(button, "scale"))).toBeLessThan(0.98);

  await page.mouse.up();
  await expect.poll(() => computed(button, "scale")).toMatch(/^(none|1)$/);
});

test("Liquid Ripple Button：按下时生成一道波纹，扩散结束后移除", async ({ page }) => {
  const main = await openMain(page, "liquid-ripple-button");
  const button = main.locator('[data-slot="liquid-ripple-button"]');

  await button.click();

  await expect(button.locator('[data-slot="ripple"]')).toHaveCount(1);
  await expect(button.locator('[data-slot="ripple"]')).toHaveCount(0);
});

test("Neon Edge Button：边缘光持续旋转，减少动态效果时停止", async ({ page }) => {
  const main = await openMain(page, "neon-edge-button");
  const light = main.locator('[data-slot="neon-edge-light"]');
  expect(await computed(light, "animation-name")).toBe("spin");

  await page.emulateMedia({ reducedMotion: "reduce" });

  expect(await computed(light, "animation-name")).toBe("none");
});

test("Book Call Button：悬停时信号色胶囊铺满按钮，可访问名称不变", async ({ page }) => {
  const main = await openMain(page, "book-call-button");
  const button = main.getByRole("button", { name: "Book a call" });
  const capsule = button.locator('[data-slot="book-call-capsule"]');
  const restWidth = (await capsule.boundingBox())!.width;

  await button.hover();

  const buttonWidth = (await button.boundingBox())!.width;
  await expect
    .poll(async () => (await capsule.boundingBox())!.width)
    .toBeGreaterThan(buttonWidth - 16);
  expect(restWidth).toBeLessThan(40);
  await expect(button).toHaveAccessibleName("Book a call");
});

test("Typewriter Button：点击后逐字重新显示，过程中可访问名称保持完整", async ({ page }) => {
  const main = await openMain(page, "typewriter-button");
  const button = main.locator('[data-slot="typewriter-button"]');
  const text = button.getByTestId("typewriter-text");
  const full = (await text.textContent())!;

  await button.click();

  await expect.poll(async () => (await text.textContent())!.length).toBeLessThan(full.length);
  await expect(button).toHaveAccessibleName(full);
  await expect(text).toHaveText(full);
});

test("Split Button：箭头按钮打开菜单，键盘选择一项后执行并把焦点还给箭头按钮", async ({ page }) => {
  const main = await openMain(page, "split-button");
  const trigger = main.getByRole("button", { name: "More actions" });

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem")).toHaveCount(3);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(page.getByRole("menu")).toBeHidden();
  await expect(main.getByTestId("split-result")).not.toHaveText("尚未操作");
  await expect(trigger).toBeFocused();
});

test("Split Button：主操作直接执行，不打开菜单", async ({ page }) => {
  const main = await openMain(page, "split-button");

  await main.getByRole("button", { name: "保存" }).click();

  await expect(main.getByTestId("split-result")).toHaveText("保存");
  await expect(page.getByRole("menu")).toBeHidden();
});

for (const slug of SLUGS) {
  for (const scheme of ["light", "dark"] as const) {
    test(`${slug} 的详情页在${scheme === "dark" ? "深色" : "浅色"}主题下没有 axe 违规`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(`/components/${slug}`);
      await waitForEntranceAnimations(page);

      const { violations } = await new AxeBuilder({ page }).analyze();

      expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
    });
  }
}
