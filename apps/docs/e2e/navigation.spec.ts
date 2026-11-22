/**
 * 导航、布局与 P1 复杂原语（批次 N1）真实浏览器行为与双主题 axe 验证。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "./support/test";

const NAV_SLUGS = [
  "tabs",
  "accordion",
  "slider",
  "number-input",
  "tree",
  "reorder-list",
  "resizable-panels",
  "breadcrumb",
  "pagination",
] as const;

test("Tree 支持键盘方向键展开折叠与节点选择（ADR-001 UI SDK 保护用例）", async ({ page }) => {
  await page.goto("/components/tree");
  const block = page.getByTestId("specimen-block").first();
  const root = block.getByRole("treeitem", { name: /packages/ });
  await root.focus();
  await page.keyboard.press("ArrowRight");
  const uiBranch = block.getByRole("treeitem", { name: /^ui$/ });
  await expect(uiBranch).toBeVisible();
  await uiBranch.focus();
  await page.keyboard.press("ArrowRight");
  const item = block.getByRole("treeitem", { name: /button\.tsx/ });
  await item.click();
  await expect(block.getByText("已选节点：packages/ui/button.tsx")).toBeVisible();
});

test("ReorderList 支持纯键盘 Space + ArrowDown + Space 重排（ADR-001 UI SDK 保护用例）", async ({
  page,
}) => {
  await page.goto("/components/reorder-list");
  const block = page.getByTestId("specimen-block").first();
  const firstOption = block.getByRole("option").first();
  await firstOption.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Space");
  await expect(block.getByText("当前顺序：unit → lint → registry → e2e")).toBeVisible();
});

test("ResizablePanels 分隔手柄支持键盘方向键调整占比", async ({ page }) => {
  await page.goto("/components/resizable-panels");
  const block = page.getByTestId("specimen-block").first();
  const handle = block.getByRole("separator", { name: "调整面板比例" });
  const before = await handle.getAttribute("aria-valuenow");
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(handle).not.toHaveAttribute("aria-valuenow", before ?? "");
});

for (const slug of NAV_SLUGS) {
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
