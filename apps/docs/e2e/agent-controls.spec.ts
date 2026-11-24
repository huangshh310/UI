/**
 * TriggerMenu、TokenInput、Waterfall 与 ColorPicker 展示站详情页真实浏览器交互与双主题 axe 无障碍规约。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { waitForEntranceAnimations } from "./support/animations";
import { expect, test } from "./support/test";

test.describe("新增高阶交互组件详情页行为", () => {
  test("TriggerMenu 包裹 PromptInput 光标触发与回车指令补全", async ({ page }) => {
    await page.goto("/components/trigger-menu");

    const block = page.locator("#prompt-composer");
    const textarea = block.getByLabel("智能体指令输入框");
    await textarea.click();
    await page.keyboard.type("/rev");

    await expect(page.getByRole("option", { name: /review/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(block.getByTestId("trigger-prompt-log")).toContainText("已插入引用：/review");
  });

  test("TokenInput 内联胶囊移除与纯文本序列化联动", async ({ page }) => {
    await page.goto("/components/token-input");

    const block = page.locator("#basic");
    await expect(block.getByTestId("token-serialized-output")).toContainText("src/router.ts");
    await block.locator('[data-slot="token-input-token-remove"]').last().click();
    await expect(block.getByTestId("token-serialized-output")).not.toContainText("src/router.ts");
  });

  test("Waterfall 树表行点击选中与全部折叠控制联动", async ({ page }) => {
    await page.goto("/components/waterfall");

    const block = page.locator("#basic");
    await block.getByText("向量文档召回").click();
    await expect(block.getByTestId("waterfall-selected-span")).toContainText("向量文档召回");

    await block.getByRole("button", { name: "全部折叠" }).click();
    await expect(block.getByRole("treegrid").getByText("向量文档召回")).toHaveCount(0);
  });

  test("ColorPicker 预设色块切换与色值预览实时同步", async ({ page }) => {
    await page.goto("/components/color-picker");

    const block = page.locator("#basic");
    await block.locator('[data-slot="color-picker-swatch-item"]').nth(2).click();
    await expect(block.getByTestId("color-picker-output")).toContainText("#10b981");
  });
});

for (const slug of ["trigger-menu", "token-input", "waterfall", "color-picker"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`${slug} 详情页在${theme === "light" ? "浅色" : "深色"}主题下没有 axe 违规`, async ({
      page,
    }) => {
      await page.addInitScript((value) => localStorage.setItem("matt-ui-theme", value), theme);
      await page.goto(`/components/${slug}`);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await waitForEntranceAnimations(page);

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
    });
  }
}
