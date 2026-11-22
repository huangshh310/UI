/**
 * 动效组件（批次 M1）与组合页面区块（批次 B1）真实浏览器交互及双主题 axe 校验。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "./support/test";

const MOTION_AND_BLOCK_SLUGS = [
  "number-flow",
  "animated-text",
  "spotlight-card",
  "folder-tab-card",
  "staggered-list",
  "hold-to-confirm",
  "segmented-control",
  "ai-orb",
  "ai-voice-stage",
  "audio-waves",
  "ai-chat-thread",
  "ai-model-selector",
  "ai-prompt-gallery",
  "ai-agent-plan",
  "ai-reasoning",
  "ai-tool-call",
  "ai-approval-card",
  "ai-citation",
  "ai-artifact",
  "ai-canvas-card",
  "ai-token-meter",
  "ai-diff-review",
  "auth-block",
  "pricing-block",
  "dashboard-shell-block",
  "settings-block",
  "file-manager-block",
  "hero-bento-block",
  "stats-overview-block",
  "team-members-block",
  "billing-usage-block",
  "activity-feed-block",
  "ai-workspace-block",
  "ai-agent-cockpit-block",
  "onboarding-wizard-block",
] as const;

test("AI 组件交互：AiTokenMeter 压缩上下文与 AiApprovalCard 批准执行", async ({ page }) => {
  await page.goto("/components/ai-token-meter");
  const meterBlock = page.getByTestId("specimen-block").first();
  await meterBlock.getByRole("button", { name: "压缩上下文" }).click();
  await expect(meterBlock.getByText(/已压缩 -36%/)).toBeVisible();

  await page.goto("/components/ai-approval-card");
  const approvalBlock = page.getByTestId("specimen-block").first();
  await approvalBlock.getByRole("button", { name: "批准执行" }).click();
  await expect(approvalBlock.getByText("已批准执行")).toBeVisible();

  await page.goto("/components/ai-chat-thread");
  const chatBlock = page.getByTestId("specimen-block").first();
  await chatBlock.getByRole("button", { name: "下一版本回复" }).click();
  await expect(chatBlock.getByText("2 / 2")).toBeVisible();

  await page.goto("/components/ai-agent-plan");
  const planBlock = page.getByTestId("specimen-block").first();
  await planBlock.getByRole("button", { name: "推进下一步" }).click();
  await expect(planBlock.getByText(/2 \/ 4 步/)).toBeVisible();
});

test("区块详情页支持桌面/平板/移动预览宽度实时切换", async ({ page }) => {
  await page.goto("/components/team-members-block");
  const main = page.getByTestId("component-main");
  const tabletBtn = main.getByRole("button", { name: "平板 768px" });
  await tabletBtn.click();
  await expect(tabletBtn).toHaveAttribute("aria-pressed", "true");
  const mobileBtn = main.getByRole("button", { name: "移动 390px" });
  await mobileBtn.click();
  await expect(mobileBtn).toHaveAttribute("aria-pressed", "true");
});

test("PricingBlock 切换按年计费更新滚动价格并响应套餐按钮", async ({ page }) => {
  await page.goto("/components/pricing-block");
  const block = page.getByTestId("specimen-block").first();
  await block.getByRole("switch", { name: "按年计费" }).click();
  await block.getByRole("button", { name: "升级专业版" }).click();
  await expect(block.getByText("已选择 pro（yearly）")).toBeVisible();
});

test("AuthBlock 支持表单提交与登录/注册模式切换", async ({ page }) => {
  await page.goto("/components/auth-block");
  const block = page.getByTestId("specimen-block").first();
  await block.getByLabel("工作邮箱").fill("demo@matt.dev");
  await block.getByLabel("密码").fill("pass-1234");
  await block.getByRole("button", { name: "立即登录" }).click();
  await expect(block.getByText("已提交 登录：demo@matt.dev")).toBeVisible();
});

test("FileManagerBlock 勾选文件后呼出 SelectionBasket 并支持删除", async ({ page }) => {
  await page.goto("/components/file-manager-block");
  const block = page.getByTestId("specimen-block").first();
  await block.getByRole("checkbox", { name: "选择 design-tokens.css" }).click();
  await expect(block.getByText("已选 1 项")).toBeVisible();
  await block.getByRole("button", { name: "删除" }).click();
  await expect(block.getByText("design-tokens.css")).toBeHidden();
});

for (const slug of MOTION_AND_BLOCK_SLUGS) {
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
