/**
 * Dialog 与 Popover 的行为规约：焦点陷阱、焦点恢复、滚动锁定、背景不可交互、
 * 嵌套浮层的 Escape 逐层关闭。同一组断言分别运行在 Base UI 与 UI SDK 的实现上。
 */
import { expect, test, type Page } from "@playwright/test";
import { ENGINES, isFocusInside } from "./support/engines";

/**
 * 打开「Edit profile」对话框，并等初始焦点进入对话框内部。
 * 初始焦点的移动由单独的用例验证；其余用例等它完成后再操作，
 * 避免把「焦点还没来得及进入」误判为别的问题。
 */
const openProfileDialog = async (page: Page) => {
  await page.getByRole("button", { name: "Edit profile" }).click();
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => isFocusInside(dialog)).toBe(true);
  return dialog;
};

for (const engine of ENGINES) {
  test.describe(`${engine} · Dialog`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${engine}/dialog`);
    });

    test("键盘打开后是具名的 dialog，焦点进入对话框内部", async ({ page }) => {
      await page.getByRole("button", { name: "Edit profile" }).focus();
      await page.keyboard.press("Enter");

      const dialog = page.getByRole("dialog", { name: "Edit profile" });
      await expect(dialog).toBeVisible();
      await expect.poll(() => isFocusInside(dialog)).toBe(true);
    });

    test("Tab 与 Shift+Tab 之后焦点都会回到对话框内", async ({ page }) => {
      const dialog = await openProfileDialog(page);

      for (const key of ["Tab", "Tab", "Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab"]) {
        await page.keyboard.press(key);
        await expect.poll(() => isFocusInside(dialog), `按下 ${key} 后`).toBe(true);
      }
    });

    test("快速连续按 Tab 时焦点从不短暂落到对话框外", async ({ page }) => {
      test.fail(
        engine === "base-ui",
        "Base UI 的焦点陷阱由脚本实现：焦点先落到对话框外（焦点哨兵、body、触发按钮，" +
          "偶尔是背景按钮），随后才被拉回。UI SDK 使用原生 top layer，没有这个瞬间。",
      );
      const dialog = await openProfileDialog(page);

      let outside = 0;
      for (let press = 0; press < 30; press += 1) {
        await page.keyboard.press("Tab");
        if (!(await isFocusInside(dialog))) outside += 1;
      }

      expect(outside, "按键后瞬间位于对话框外的次数").toBe(0);
    });

    test("Escape 关闭对话框并把焦点还给触发按钮", async ({ page }) => {
      const trigger = page.getByRole("button", { name: "Edit profile" });
      await trigger.click();
      await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible();
      await page.keyboard.press("Escape");

      await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test("对话框打开时页面不能滚动", async ({ page }) => {
      await page.getByRole("button", { name: "Edit profile" }).click();
      await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible();

      await page.mouse.move(20, 20);
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(200);

      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    });

    test("对话框打开时背景按钮不可交互", async ({ page }) => {
      await page.getByRole("button", { name: "Edit profile" }).click();
      await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible();

      // 直接在背景按钮的坐标上点击，绕过 Playwright 的可操作性检查
      const box = await page.getByTestId("outside-action").boundingBox();
      await page.mouse.click(box!.x + 5, box!.y + 5);

      await expect(page.getByTestId("outside-count")).toHaveText("0");
    });

    test("对话框内的 Select 按 Escape 只关闭自己，再按一次才关闭对话框", async ({ page }) => {
      await page.getByRole("button", { name: "Edit profile" }).click();
      const dialog = page.getByRole("dialog", { name: "Edit profile" });
      await dialog.getByRole("combobox", { name: "Fruit" }).focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("listbox")).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(dialog).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    });
  });

  test.describe(`${engine} · Popover`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${engine}/dialog`);
    });

    test("打开后是具名的 dialog，Escape 关闭并恢复焦点", async ({ page }) => {
      const trigger = page.getByRole("button", { name: "Details" });
      await trigger.click();
      await expect(page.getByRole("dialog", { name: "Details" })).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(page.getByRole("dialog", { name: "Details" })).toBeHidden();
      await expect(trigger).toBeFocused();
    });

    test("点击外部关闭", async ({ page }) => {
      await page.getByRole("button", { name: "Details" }).click();
      await expect(page.getByRole("dialog", { name: "Details" })).toBeVisible();
      await page.mouse.click(700, 600);

      await expect(page.getByRole("dialog", { name: "Details" })).toBeHidden();
    });
  });
}
