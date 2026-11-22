/**
 * Tree 的行为规约：层级展开、方向键、Home / End、选择状态。
 * Base UI 没有 Tree 组件，这里只验证 UI SDK，回答「它能否填补这个缺口」。
 */
import { expect, test } from "@playwright/test";

test.describe("ui-sdk · Tree", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ui-sdk/tree");
  });

  test("是具名的 tree，折叠的分支不显示子项", async ({ page }) => {
    await expect(page.getByRole("tree", { name: "Files" })).toBeVisible();
    await expect(page.getByRole("treeitem", { name: "src" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByRole("treeitem", { name: "index.ts" })).toBeHidden();
  });

  test("右方向键展开分支并进入子项，左方向键回到父项并折叠", async ({ page }) => {
    const branch = page.getByRole("treeitem", { name: "src" });
    await branch.focus();

    await page.keyboard.press("ArrowRight");
    await expect(branch).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("treeitem", { name: "index.ts" })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("treeitem", { name: "index.ts" })).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(branch).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(branch).toHaveAttribute("aria-expanded", "false");
  });

  test("上下方向键在可见行之间移动，Home 与 End 跳到首尾", async ({ page }) => {
    await page.getByRole("treeitem", { name: "src" }).focus();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("treeitem", { name: "package.json" })).toBeFocused();

    await page.keyboard.press("End");
    await expect(page.getByRole("treeitem", { name: "README.md" })).toBeFocused();

    await page.keyboard.press("Home");
    await expect(page.getByRole("treeitem", { name: "src" })).toBeFocused();
  });

  test("Enter 选中当前行", async ({ page }) => {
    const item = page.getByRole("treeitem", { name: "package.json" });
    await item.focus();
    await page.keyboard.press("Enter");

    await expect(item).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("value")).toHaveText("package.json");
  });
});
