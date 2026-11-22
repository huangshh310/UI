/**
 * 每个页面的整体健康检查：服务端渲染出语义标记、Hydration 无告警、
 * axe 无违规，并记录页面加载的 JS 体积供两套实现对比。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

/** 页面路径，以及服务端 HTML 中必须出现的语义标记 */
const PAGES = [
  { path: "/baseline", ssrMarker: "<h1" },
  { path: "/base-ui/select", ssrMarker: 'role="combobox"' },
  { path: "/ui-sdk/select", ssrMarker: 'role="combobox"' },
  { path: "/base-ui/combobox", ssrMarker: 'role="combobox"' },
  { path: "/ui-sdk/combobox", ssrMarker: 'role="combobox"' },
  { path: "/base-ui/dialog", ssrMarker: 'aria-haspopup="dialog"' },
  { path: "/ui-sdk/dialog", ssrMarker: 'aria-haspopup="dialog"' },
  { path: "/ui-sdk/tree", ssrMarker: 'role="tree"' },
  { path: "/ui-sdk/reorder", ssrMarker: 'role="listbox"' },
];

for (const { path, ssrMarker } of PAGES) {
  test.describe(`页面健康 · ${path}`, () => {
    test("服务端返回的 HTML 已包含语义标记", async ({ request }) => {
      const html = await (await request.get(path)).text();

      expect(html).toContain(ssrMarker);
    });

    test("加载与 Hydration 期间控制台没有错误或警告", async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (message) => {
        if (["error", "warning"].includes(message.type())) problems.push(message.text());
      });
      page.on("pageerror", (error) => problems.push(error.message));

      await page.goto(path, { waitUntil: "networkidle" });

      expect(problems).toEqual([]);
    });

    test("初始状态下 axe 没有违规", async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();

      expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
    });

    test("记录页面加载的 JS 体积", async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      // 用浏览器的 Resource Timing 统计脚本体积：transfer 是压缩后的传输量，decoded 是解压后的大小
      const sizes = await page.evaluate(() => {
        const scripts = performance
          .getEntriesByType("resource")
          .filter((entry) => entry.name.endsWith(".js")) as PerformanceResourceTiming[];
        return {
          files: scripts.length,
          transfer: scripts.reduce((sum, entry) => sum + entry.transferSize, 0),
          decoded: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        };
      });

      // 体积只做记录，不设阈值；汇总后的对比写入 ADR-001
      mkdirSync("test-results/js-bytes", { recursive: true });
      writeFileSync(
        `test-results/js-bytes/${path.slice(1).replace("/", "-")}.json`,
        JSON.stringify({ path, ...sizes }),
      );
      expect(sizes.decoded).toBeGreaterThan(0);
    });
  });
}
