/**
 * Select 的行为规约：单选、键盘导航、typeahead、Escape、点击外部、受控重置、触摸。
 * 同一组断言分别运行在 Base UI 与 UI SDK 的实现上。
 */
import { expect, test, type Page } from "@playwright/test";
import { ENGINES, FRUIT_LABELS, valueOutput } from "./support/engines";

/**
 * 在已聚焦的触发器上用 Enter 打开列表，并等焦点进入列表。
 *
 * 只等「列表可见」是不够的：实测 Base UI 的列表在按键后约 13ms 可见，
 * 焦点却要到约 29ms 才移入列表，这一帧多的间隙里按下的导航键会丢失。
 * UI SDK 的列表可见与焦点移入发生在同一帧。真人按键落不进这个间隙，
 * 但自动化脚本和高负载下的机器可以，所以这里等焦点就位后再继续。
 */
const openWithKeyboard = async (page: Page) => {
  await page.keyboard.press("Enter");
  await expect(page.locator('[role="option"]:focus')).toHaveCount(1);
};

for (const engine of ENGINES) {
  test.describe(`${engine} · Select`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${engine}/select`);
    });

    test("触发器是具名的 combobox，Enter 打开包含全部选项的 listbox", async ({ page }) => {
      const trigger = page.getByRole("combobox", { name: "Fruit" });
      await trigger.focus();
      await page.keyboard.press("Enter");

      await expect(page.getByRole("listbox")).toBeVisible();
      await expect(page.getByRole("option")).toHaveText(FRUIT_LABELS);
    });

    test("Home、方向键移动高亮，Enter 选中后关闭并把焦点还给触发器", async ({ page }) => {
      const trigger = page.getByRole("combobox", { name: "Fruit" });
      await trigger.focus();
      await openWithKeyboard(page);
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(valueOutput(page)).toHaveText("cherry");
      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(trigger).toContainText("Cherry");
    });

    test("End 跳到最后一项", async ({ page }) => {
      await page.getByRole("combobox", { name: "Fruit" }).focus();
      await openWithKeyboard(page);
      await page.keyboard.press("End");
      await page.keyboard.press("Enter");

      await expect(valueOutput(page)).toHaveText("mango");
    });

    test("列表打开时键入字母跳到匹配项（typeahead）", async ({ page }) => {
      await page.getByRole("combobox", { name: "Fruit" }).focus();
      await openWithKeyboard(page);
      await page.keyboard.type("g");
      await page.keyboard.press("Enter");

      await expect(valueOutput(page)).toHaveText("grape");
    });

    test("Escape 关闭但不选中，焦点回到触发器", async ({ page }) => {
      const trigger = page.getByRole("combobox", { name: "Fruit" });
      await trigger.focus();
      await openWithKeyboard(page);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Escape");

      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(valueOutput(page)).toHaveText("none");
      await expect(trigger).toBeFocused();
    });

    test("点击外部关闭但不选中", async ({ page }) => {
      await page.getByRole("combobox", { name: "Fruit" }).click();
      await expect(page.getByRole("listbox")).toBeVisible();
      await page.mouse.click(600, 500);

      await expect(page.getByRole("listbox")).toBeHidden();
      await expect(valueOutput(page)).toHaveText("none");
    });

    test("受控：外部把值重置为空后，触发器回到占位文本", async ({ page }) => {
      const trigger = page.getByRole("combobox", { name: "Fruit" });
      await trigger.click();
      await page.getByRole("option", { name: "Banana" }).click();
      await expect(valueOutput(page)).toHaveText("banana");

      await page.getByRole("button", { name: "Reset" }).click();

      await expect(valueOutput(page)).toHaveText("none");
      await expect(trigger).toContainText("Select a fruit");
    });

    test("触摸点按可以打开并选中 @touch", async ({ page }) => {
      await page.getByRole("combobox", { name: "Fruit" }).tap();
      await page.getByRole("option", { name: "Mango" }).tap();

      await expect(valueOutput(page)).toHaveText("mango");
      await expect(page.getByRole("listbox")).toBeHidden();
    });
  });
}
