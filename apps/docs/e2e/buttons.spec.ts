/**
 * Buttons 分类各组件在真实浏览器中的行为规约。
 * 每个组件在自己的详情页主面板里检查它最核心的那一个交互，并做一次 axe 扫描。
 */
import { AxeBuilder } from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./support/test";
import { waitForEntranceAnimations } from "./support/animations";

const SLUGS = [
  "press-button",
  "liquid-ripple-button",
  "neon-edge-button",
  "book-call-button",
  "typewriter-button",
  "split-button",
  "magnetic-button",
  "morphing-button",
  "drag-to-confirm",
  "liquid-toggle",
  "code-snippet-deck",
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
  // 波纹只存在约 650ms。在页面内记录出现过的最大波纹数，
  // 这样断言不依赖测试进程与浏览器之间的往返速度，慢机器上也稳定
  await button.evaluate((el) => {
    const seen = { max: 0 };
    Object.assign(window, { rippleCount: seen });
    new MutationObserver(() => {
      seen.max = Math.max(seen.max, el.querySelectorAll('[data-slot="ripple"]').length);
    }).observe(el, { childList: true });
  });

  await button.click();

  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { rippleCount: { max: number } }).rippleCount.max),
    )
    .toBe(1);
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

test("Magnetic Button：指针在按钮上移动时被吸过去，离开后回到原位", async ({ page }) => {
  const main = await openMain(page, "magnetic-button");
  const wrapper = main.locator('[data-slot="magnetic-button"]');
  const box = (await wrapper.boundingBox())!;

  await page.mouse.move(box.x + box.width - 4, box.y + box.height - 4, { steps: 6 });
  await expect
    .poll(() => computed(wrapper, "transform"))
    .not.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

  await page.mouse.move(box.x + box.width + 300, box.y + 300, { steps: 4 });
  await expect
    .poll(() => computed(wrapper, "transform"))
    .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
});

test("Morphing Button：点击后依次变为处理中与已保存", async ({ page }) => {
  const main = await openMain(page, "morphing-button");

  await main.getByRole("button", { name: "保存更改" }).click();

  await expect(main.getByRole("button", { name: "保存中…" })).toHaveAttribute("aria-busy", "true");
  await expect(main.getByRole("button", { name: "已保存" })).toBeVisible();
});

test("Drag to Confirm：拖到尽头确认，半途松手弹回", async ({ page }) => {
  const main = await openMain(page, "drag-to-confirm");
  const track = main.locator('[data-slot="drag-to-confirm"]');
  const handle = main.locator('[data-slot="drag-to-confirm-handle"]');
  const trackBox = (await track.boundingBox())!;
  const start = (await handle.boundingBox())!;
  const grab = { x: start.x + start.width / 2, y: start.y + start.height / 2 };

  await page.mouse.move(grab.x, grab.y);
  await page.mouse.down();
  await page.mouse.move(grab.x + 60, grab.y, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => (await handle.boundingBox())!.x).toBeLessThan(start.x + 4);
  await expect(track).not.toHaveAttribute("data-confirmed");

  await page.mouse.move(grab.x, grab.y);
  await page.mouse.down();
  await page.mouse.move(trackBox.x + trackBox.width, grab.y, { steps: 12 });
  await page.mouse.up();
  await expect(track).toHaveAttribute("data-confirmed", "");
});

test("Drag to Confirm：键盘聚焦滑块后按 Enter 确认", async ({ page }) => {
  const main = await openMain(page, "drag-to-confirm");

  await main.getByRole("button", { name: /滑动以删除项目/ }).focus();
  await page.keyboard.press("Enter");

  await expect(main.locator('[data-slot="drag-to-confirm"]')).toHaveAttribute("data-confirmed", "");
});

test("Liquid Toggle：点击切换，空格键也能切换", async ({ page }) => {
  const main = await openMain(page, "liquid-toggle");
  const toggle = main.getByRole("switch", { name: "推送通知" });
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-checked", "true");
});

test("Code Snippet Deck：切换语言并修改参数，代码随之更新", async ({ page }) => {
  const main = await openMain(page, "code-snippet-deck");

  await main.getByRole("tab", { name: "Python" }).click();
  await main.getByRole("textbox", { name: "Limit" }).fill("7");

  await expect(main.getByTestId("snippet-code")).toHaveText(
    'requests.get("https://api.tidewater.dev/v1/projects", params={"limit": 7})',
  );
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
