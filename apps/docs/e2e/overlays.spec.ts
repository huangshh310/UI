/**
 * 浮层组件（批次 O1 + O2）在真实浏览器中的行为、焦点管理、ADR-001 Base UI 偏差 #1 监控与可访问性验证。
 */
import { AxeBuilder } from "@axe-core/playwright";
import type { Locator } from "@playwright/test";
import { expect, test } from "./support/test";

const OVERLAY_SLUGS = [
  "settle-modal",
  "sheet",
  "directional-tooltip",
  "origin-dropdown",
  "peek-card",
  "morphing-dialog",
  "command-menu",
  "spotlight-search",
  "selection-basket",
  "avatar-stack",
  "intro-loader",
] as const;

const isFocusInside = (container: Locator) =>
  container.evaluate((node) => node.contains(document.activeElement));

test.describe("SettleModal 与 Base UI 偏差 #1 监控", () => {
  test("打开居中模态框、支持 Tab 焦点循环与 Escape 关闭焦点恢复", async ({ page }) => {
    await page.goto("/components/settle-modal");
    const block = page.getByTestId("specimen-block").first();
    const trigger = block.getByRole("button", { name: "打开模态框" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "发布生产版本" });
    await expect(dialog).toBeVisible();
    await expect.poll(() => isFocusInside(dialog)).toBe(true);

    for (const key of ["Tab", "Tab", "Shift+Tab"]) {
      await page.keyboard.press(key);
      await expect.poll(() => isFocusInside(dialog)).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("快速连续按 Tab 时焦点从不短暂落到模态框外（ADR-001 Base UI 偏差 #1）", async ({ page }) => {
    test.fail(
      true,
      "Base UI Dialog 的焦点陷阱由脚本哨兵实现：快速连续按 Tab 时焦点会瞬时落到模态框外再被拉回，持续监控上游修复。",
    );
    await page.goto("/components/settle-modal");
    await page
      .getByTestId("specimen-block")
      .first()
      .getByRole("button", { name: "打开模态框" })
      .click();
    const dialog = page.getByRole("dialog", { name: "发布生产版本" });
    await expect(dialog).toBeVisible();
    await expect.poll(() => isFocusInside(dialog)).toBe(true);

    let outside = 0;
    for (let press = 0; press < 30; press += 1) {
      await page.keyboard.press("Tab");
      if (!(await isFocusInside(dialog))) outside += 1;
    }
    expect(outside, "按键后瞬间位于对话框外的次数").toBe(0);
  });
});

test.describe("其余核心浮层交互", () => {
  test("Sheet 默认以四周圆角悬浮留白模式从右侧展开，并可按 Escape 关闭", async ({ page }) => {
    await page.goto("/components/sheet");
    const block = page.getByTestId("specimen-block").first();
    const trigger = block.getByRole("button", { name: "打开右侧抽屉" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "节点运行配置" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-inset", "true");
    const box = await dialog.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(8);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("OriginDropdown 展开菜单并触发动作", async ({ page }) => {
    await page.goto("/components/origin-dropdown");
    const block = page.getByTestId("specimen-block").first();
    await block.getByRole("button", { name: "工作区菜单" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.getByRole("menuitem", { name: /重命名项目/ }).click();
    await expect(block.getByText("最近操作：重命名项目")).toBeVisible();
  });

  test("CommandMenu（UI SDK 单底座）打开后支持钻入二级页面并执行命令", async ({ page }) => {
    await page.goto("/components/command-menu");
    const block = page.getByTestId("specimen-block").first();
    await block.getByRole("button", { name: /打开命令面板/ }).click();

    const dialog = page.getByRole("dialog", { name: "命令面板" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("option", { name: /切换主题配色/ }).click();
    await expect(dialog.getByText("选择主题")).toBeVisible();
    await dialog.getByRole("option", { name: /曜石深色/ }).click();
    await expect(block.getByText("已执行：theme-dark")).toBeVisible();
  });

  test("SpotlightSearch 按分类筛选并联动预览分栏", async ({ page }) => {
    await page.goto("/components/spotlight-search");
    const block = page.getByTestId("specimen-block").first();
    await block.getByRole("button", { name: "打开聚焦搜索" }).click();
    const dialog = page.getByRole("dialog", { name: "聚焦搜索" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "AI", exact: true }).click();
    await dialog.getByRole("button", { name: /PromptInput 对话输入器/ }).click();
    await expect(block.getByText("最近选中：PromptInput 对话输入器")).toBeVisible();
  });
});

for (const slug of OVERLAY_SLUGS) {
  for (const theme of ["light", "dark"] as const) {
    test(`${slug} 的详情页在${theme === "light" ? "浅色" : "深色"}主题下没有 axe 违规`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(`/components/${slug}`);

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
    });
  }
}
