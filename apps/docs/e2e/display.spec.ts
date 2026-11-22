/**
 * 展示与反馈组件（批次 D1）真实浏览器交互与双主题 axe 校验。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "./support/test";

const DISPLAY_SLUGS = [
  "card",
  "badge",
  "alert",
  "toast",
  "progress",
  "skeleton",
  "separator",
  "spinner",
  "empty-state",
] as const;

test("Toast 触发通知卡片并可手动关闭", async ({ page }) => {
  await page.goto("/components/toast");
  const block = page.getByTestId("specimen-block").first();
  await block.getByRole("button", { name: "成功通知" }).click();
  await expect(page.getByText("已同步最新 Registry")).toBeVisible();
  await page.getByRole("button", { name: "关闭通知" }).first().click();
});

test("Alert 可关闭按钮正常收起横幅", async ({ page }) => {
  await page.goto("/components/alert");
  const block = page.getByTestId("specimen-block").first();
  await expect(block.getByText("发现 1 个待更新的锁版本依赖")).toBeVisible();
  await block.getByRole("button", { name: "关闭提示" }).click();
  await expect(block.getByText("发现 1 个待更新的锁版本依赖")).toBeHidden();
});

for (const slug of DISPLAY_SLUGS) {
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
