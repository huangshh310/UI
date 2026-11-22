/**
 * Forms 第一批（F1）组件在真实浏览器中的行为规约。
 * 覆盖 7 个表单组件的核心交互、双主题 axe 扫描，以及 ADR-001 中记录的 Base UI Select / Combobox 偏差。
 */
import { AxeBuilder } from "@axe-core/playwright";
import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./support/test";
import { waitForEntranceAnimations } from "./support/animations";

const SLUGS = [
  "lock-input",
  "draw-checkbox",
  "stretch-switch",
  "spring-select",
  "combobox",
  "otp-input",
  "form",
];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** 打开组件详情页，返回主面板 */
const openMain = async (page: Page, slug: string): Promise<Locator> => {
  await page.goto(`/components/${slug}`);
  return page.getByTestId("component-main");
};

const computed = (locator: Locator, property: string) =>
  locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);

/**
 * 在已聚焦的 Select 触发器上用 Enter 打开列表，并等待焦点进入选项。
 * 对应 ADR-001 Base UI 偏差 #3：列表可见后焦点移入滞后约一帧，等选项获焦后再发导航键。
 */
const openSelectWithKeyboard = async (page: Page) => {
  await page.keyboard.press("Enter");
  await expect(page.locator('[role="option"]:focus')).toHaveCount(1);
};

test("Lock Input：聚焦时焦点环显现并锁定，locked 输入框为只读", async ({ page }) => {
  const main = await openMain(page, "lock-input");
  const email = main.getByLabel("工作邮箱");
  const ring = main.locator('[data-slot="lock-input-ring"]').first();

  await expect.poll(() => computed(ring, "opacity")).toBe("0");
  await email.focus();
  await expect.poll(() => computed(ring, "opacity")).toBe("1");

  const locked = main.getByLabel("项目标识");
  await expect(locked).toHaveAttribute("readonly", "");
});

test("Draw Checkbox：点击与空格切换勾选状态，对勾路径完整绘制", async ({ page }) => {
  const main = await openMain(page, "draw-checkbox");
  const checkbox = main.getByRole("checkbox", { name: /发布前自动校验无障碍规则/ });
  await expect(checkbox).toHaveAttribute("aria-checked", "true");

  await checkbox.click();
  await expect(checkbox).toHaveAttribute("aria-checked", "false");

  await page.keyboard.press("Space");
  await expect(checkbox).toHaveAttribute("aria-checked", "true");
  const path = checkbox.locator("path");
  await expect.poll(() => computed(path, "stroke-dashoffset")).toBe("0px");
});

test("Stretch Switch：按住时滑块横向拉伸，点击与空格可切换开关", async ({ page }) => {
  const main = await openMain(page, "stretch-switch");
  const sw = main.getByRole("switch", { name: /合并后自动部署预览/ });
  const thumb = sw.locator('[data-slot="stretch-switch-thumb"]');
  const restWidth = (await thumb.boundingBox())!.width;

  const box = (await sw.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => (await thumb.boundingBox())!.width).toBeGreaterThan(restWidth + 2);
  await page.mouse.up();

  await expect(sw).toHaveAttribute("aria-checked", "false");
  await page.keyboard.press("Space");
  await expect(sw).toHaveAttribute("aria-checked", "true");
});

test("Spring Select：键盘导航、typeahead、Escape 恢复焦点与外部重置", async ({ page }) => {
  const main = await openMain(page, "spring-select");
  const trigger = main.getByRole("combobox", { name: "部署区域" });

  await trigger.focus();
  await openSelectWithKeyboard(page);
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(main.getByTestId("select-value")).toHaveText("当前节点：singapore");
  await expect(trigger).toBeFocused();

  // Typeahead 跳转后按 Escape 取消，值不变且焦点回到触发器
  await openSelectWithKeyboard(page);
  await page.keyboard.type("f");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(main.getByTestId("select-value")).toHaveText("当前节点：singapore");
  await expect(trigger).toBeFocused();

  // 受控重置回占位文案
  await main.getByRole("button", { name: "重置" }).click();
  await expect(main.getByTestId("select-value")).toHaveText("当前节点：未选择");
  await expect(trigger).toContainText("选择一个节点");
});

test("Combobox：输入过滤与高亮、键盘选中保持焦点在输入框、空状态与清除", async ({ page }) => {
  const main = await openMain(page, "combobox");
  const input = main.getByRole("combobox", { name: "技术栈" });

  await input.click();
  await page.keyboard.type("vi");
  const option = page.getByRole("option");
  await expect(option).toHaveCount(1);
  await expect(option.locator("mark")).toHaveText(/vi/i);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Vite");
  await expect(main.getByTestId("combobox-value")).toHaveText("已选值：vite");
  await expect(input).toBeFocused();

  await main.getByRole("button", { name: "清除选项" }).click();
  await expect(main.getByTestId("combobox-value")).toHaveText("已选值：未选择");

  await input.click();
  await page.keyboard.type("zzz");
  await expect(page.getByText("没有匹配的框架")).toBeVisible();
});

test("Combobox：浮层打开时追踪 Base UI 已知的 aria-hidden-focus 偏差（ADR-001）", async ({
  page,
}) => {
  test.fail(
    true,
    "Base UI Combobox 打开时给浮层外内容加 aria-hidden 但未移除可聚焦能力，触发 aria-hidden-focus（WCAG 4.1.2）；上游修复后本用例会意外通过以提醒更新 ADR-001。",
  );

  const main = await openMain(page, "combobox");
  const input = main.getByRole("combobox", { name: "技术栈" });
  await input.click();
  await page.keyboard.type("a");
  await expect(page.getByRole("listbox")).toBeVisible();

  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
});

test("OTP Input：逐位输入自动推进并在填满 6 位后触发完成回调", async ({ page }) => {
  const main = await openMain(page, "otp-input");
  const firstSlot = main.getByRole("textbox", { name: "二次验证安全码" });

  await firstSlot.click();
  await page.keyboard.type("492817");

  await expect(main.getByTestId("otp-status")).toHaveText("已验证：492817");
});

test("Form：提交不合法字段展示校验错误，修正后提交成功", async ({ page }) => {
  const main = await openMain(page, "form");
  await main.getByRole("button", { name: "创建项目" }).click();
  await expect(main.getByText("项目名至少 2 个字符")).toBeVisible();

  await main.getByRole("textbox", { name: "项目名称" }).fill("matt-ui");
  await main.getByRole("radio", { name: /团队私有/ }).click();
  await main.getByRole("button", { name: "创建项目" }).click();

  await expect(main.getByTestId("form-result")).toHaveText("已提交：matt-ui · team");
});

for (const slug of SLUGS) {
  for (const scheme of ["light", "dark"] as const) {
    test(`${slug} 的详情页在${scheme === "dark" ? "深色" : "浅色"}主题下没有 axe 违规`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto(`/components/${slug}`);
      await waitForEntranceAnimations(page);

      const { violations } = await new AxeBuilder({ page }).analyze();

      expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
    });
  }
}
