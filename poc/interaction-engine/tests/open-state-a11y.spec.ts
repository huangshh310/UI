/**
 * 浮层打开状态下的 axe 检查。
 * 初始状态的检查覆盖不到浮层内部的语义，这里把每种浮层打开后再扫描一次。
 *
 * 判定标准只取 WCAG 规则；axe 的 best-practice 规则作为附注记录，不影响通过与否。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ENGINES } from "./support/engines";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * 已知偏差：记录在案、预期失败的组合。
 * 用 test.fail 标记而不是跳过：一旦上游修复，用例会转为「意外通过」而报错，提醒更新结论。
 */
const KNOWN_DEVIATIONS: Record<string, string> = {
  "base-ui/combobox":
    "Base UI 的 Combobox 打开时给浮层外的内容加 aria-hidden，但没有让它们失去焦点能力，" +
    "页面上其他可聚焦元素因此触发 aria-hidden-focus（WCAG 4.1.2）",
};

/** 每个用例：页面名，以及把浮层打开的操作 */
const CASES = [
  {
    name: "select",
    open: async (page: Page) => {
      await page.getByRole("combobox", { name: "Fruit" }).click();
      await expect(page.getByRole("listbox")).toBeVisible();
    },
  },
  {
    name: "combobox",
    open: async (page: Page) => {
      await page.getByRole("combobox", { name: "Fruit", exact: true }).click();
      await page.keyboard.type("a");
      await expect(page.getByRole("listbox")).toBeVisible();
    },
  },
  {
    name: "dialog",
    open: async (page: Page) => {
      await page.getByRole("button", { name: "Edit profile" }).click();
      await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible();
    },
  },
];

const summarize = (violations: { id: string; help: string }[]) =>
  violations.map(({ id, help }) => `${id}: ${help}`);

for (const engine of ENGINES) {
  for (const { name, open } of CASES) {
    test(`${engine} · ${name} 浮层打开时没有 WCAG 违规`, async ({ page }, testInfo) => {
      const deviation = KNOWN_DEVIATIONS[`${engine}/${name}`];
      test.fail(deviation !== undefined, deviation);

      await page.goto(`/${engine}/${name}`);
      await open(page);

      const bestPractice = await new AxeBuilder({ page }).withTags(["best-practice"]).analyze();
      testInfo.annotations.push({
        type: "best-practice",
        description: summarize(bestPractice.violations).join("；") || "无",
      });

      const wcag = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(summarize(wcag.violations)).toEqual([]);
    });
  }
}
