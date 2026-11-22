/**
 * 展示站端到端测试共用的 test。
 *
 * 与 Playwright 自带的 test 只有一处不同：page.goto 会等页面水合完成再返回。
 * 页面是服务端渲染的，水合之前的点击与按键会丢失；在较慢的 CI 机器上这会造成偶发失败。
 */
import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const response = await goto(url, options);
      await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
      return response;
    };
    await use(page);
  },
});

export { expect } from "@playwright/test";
