/**
 * Combobox 的行为规约：输入过滤、空状态、焦点管理、异步选项与过期结果丢弃。
 * 同一组断言分别运行在 Base UI 与 UI SDK 的实现上。
 */
import { expect, test } from "@playwright/test";
import { ENGINES, valueOutput } from "./support/engines";

for (const engine of ENGINES) {
  test.describe(`${engine} · Combobox`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${engine}/combobox`);
    });

    test("输入后只显示匹配项，方向键加 Enter 选中并回填输入框", async ({ page }) => {
      const input = page.getByRole("combobox", { name: "Fruit", exact: true });
      await input.click();
      await page.keyboard.type("ch");

      await expect(page.getByRole("option")).toHaveText(["Cherry"]);

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(input).toHaveValue("Cherry");
      await expect(valueOutput(page)).toHaveText("cherry");
      await expect(input).toBeFocused();
    });

    test("没有匹配项时显示空状态，焦点留在输入框", async ({ page }) => {
      const input = page.getByRole("combobox", { name: "Fruit", exact: true });
      await input.click();
      await page.keyboard.type("zzz");

      await expect(page.getByText("No fruits found.")).toBeVisible();
      await expect(page.getByRole("option")).toHaveCount(0);
      await expect(input).toBeFocused();
    });

    test("异步：先显示加载中，再显示远程结果", async ({ page }) => {
      const input = page.getByRole("combobox", { name: "Async fruit" });
      await input.click();
      await page.keyboard.type("gr");

      await expect(page.getByText("Searching…")).toBeVisible();
      await expect(page.getByRole("option")).toHaveText(["Grape"]);
    });

    test("异步：连续输入时只保留最后一次查询的结果", async ({ page }) => {
      const input = page.getByRole("combobox", { name: "Async fruit" });
      await input.click();
      // 「ap」匹配 Apple 与 Grape；在它返回之前改成「ma」，最终只应出现 Mango
      await page.keyboard.type("ap");
      await input.fill("ma");

      await expect(page.getByRole("option")).toHaveText(["Mango"]);
      // 再等过一个完整的延迟周期，确认过期结果没有回头覆盖
      await page.waitForTimeout(600);
      await expect(page.getByRole("option")).toHaveText(["Mango"]);
    });
  });
}
