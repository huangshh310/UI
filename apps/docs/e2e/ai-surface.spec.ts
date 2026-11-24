/**
 * AiSurface 与 AiSurfaceAgent 展示站真实浏览器交互及深浅双主题 axe 无障碍规约。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { waitForEntranceAnimations } from "./support/animations";
import { expect, test } from "./support/test";

test.describe("AiSurface 与 AiSurfaceAgent 详情页交互", () => {
  test("AiSurface 流式增量 Patch、Schema 协同决议与纯文本降级实时联动", async ({ page }) => {
    await page.goto("/components/ai-surface");

    const patchBlock = page.locator("#streaming-patch");
    await patchBlock.getByRole("button", { name: "推送下一帧 Patch" }).click();
    await expect(patchBlock.getByText("edge-gw-02")).toBeVisible();
    await expect(patchBlock.getByText("65%")).toBeVisible();

    const askBlock = page.locator("#schema-ask");
    await askBlock.getByRole("button", { name: "确认并提交" }).click();
    await expect(askBlock.getByTestId("surface-answer-log")).toContainText(
      "已提交 (confirm-scale)",
    );

    const fallbackBlock = page.locator("#text-fallback");
    await fallbackBlock.getByLabel("巡检备注").fill("全链路压测通过");
    await expect(fallbackBlock.getByTestId("surface-text-output")).toContainText("全链路压测通过");
    await fallbackBlock.getByRole("button", { name: "模型提示词规范" }).click();
    await expect(fallbackBlock.getByTestId("surface-text-output")).toContainText("SurfaceView");
  });

  test("AiSurfaceAgent 审批护栏决议回传与高阶检索数据表过滤", async ({ page }) => {
    await page.goto("/components/ai-surface-agent");

    const approvalBlock = page.locator("#approval-diff");
    await approvalBlock.getByRole("button", { name: "批准执行" }).click();
    await expect(approvalBlock.getByTestId("agent-surface-log")).toContainText(
      "审批已通过 (approve-reload)",
    );

    const upgradeBlock = page.locator("#data-upgrade");
    await upgradeBlock.getByPlaceholder(/搜索/).fill("eu");
    await expect(upgradeBlock.getByText("worker-eu-01")).toBeVisible();
    await expect(upgradeBlock.getByText("worker-ap-01")).toHaveCount(0);
  });
});

for (const slug of ["ai-surface", "ai-surface-agent"] as const) {
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
