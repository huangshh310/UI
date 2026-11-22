/**
 * Reorder 的行为规约：键盘重排、Escape 取消、鼠标拖动、触摸拖动、屏幕阅读器播报。
 *
 * UI SDK 没有现成的排序组件，页面上的列表是用 createReorder 等行为自行组合的原语。
 * 这组用例同时回答两个问题：行为组合是否可靠，以及 Agent 依据文档组合行为的返工成本。
 */
import { expect, test, type Page } from "@playwright/test";

const INITIAL = "alpha,beta,gamma,delta";

const order = (page: Page) => page.getByTestId("order");

test.describe("ui-sdk · Reorder", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ui-sdk/reorder");
    await expect(order(page)).toHaveText(INITIAL);
  });

  test("键盘：空格拿起，方向键移动，空格放下", async ({ page }) => {
    await page.getByRole("option", { name: "Alpha" }).focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");

    await expect(order(page)).toHaveText("beta,gamma,alpha,delta");
    await expect(page.getByRole("option", { name: "Alpha" })).toBeFocused();
  });

  test("键盘：Escape 取消移动，顺序不变", async ({ page }) => {
    await page.getByRole("option", { name: "Alpha" }).focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Escape");

    await expect(order(page)).toHaveText(INITIAL);
  });

  test("键盘：未拿起时方向键只移动焦点", async ({ page }) => {
    await page.getByRole("option", { name: "Alpha" }).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.getByRole("option", { name: "Beta" })).toBeFocused();
    await expect(order(page)).toHaveText(INITIAL);
  });

  test("键盘移动会向屏幕阅读器播报", async ({ page }) => {
    await page.getByRole("option", { name: "Alpha" }).focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowDown");

    await expect(page.locator("[aria-live]").filter({ hasText: /\S/ }).first()).toBeAttached();
  });

  test("鼠标：把第一项拖到第三项之后", async ({ page }) => {
    const from = await page.getByRole("option", { name: "Alpha" }).boundingBox();
    const to = await page.getByRole("option", { name: "Gamma" }).boundingBox();

    await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2);
    await page.mouse.down();
    await page.mouse.move(to!.x + to!.width / 2, to!.y + to!.height - 2, { steps: 12 });
    await page.mouse.up();

    await expect(order(page)).toHaveText("beta,gamma,alpha,delta");
  });

  test("触摸：把第一项拖到第三项之后 @touch", async ({ page }) => {
    const from = await page.getByRole("option", { name: "Alpha" }).boundingBox();
    const to = await page.getByRole("option", { name: "Gamma" }).boundingBox();
    const start = { x: from!.x + from!.width / 2, y: from!.y + from!.height / 2 };
    const end = { x: to!.x + to!.width / 2, y: to!.y + to!.height - 2 };

    // Playwright 没有触摸拖动的高层 API，这里通过 CDP 直接派发触摸事件
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    for (let step = 1; step <= 12; step += 1) {
      const y = start.y + ((end.y - start.y) * step) / 12;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: end.x, y }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

    await expect(order(page)).toHaveText("beta,gamma,alpha,delta");
  });
});
