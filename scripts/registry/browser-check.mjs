/**
 * 在真实浏览器里检查通过 shadcn CLI 安装的 Button。
 *
 * 运行环境是一个全新的 shadcn 项目，使用它自己的主题。这里确认三件事：
 * 随组件分发的信号色生效、点击可以触发、加载中不可重复触发。
 */
import { chromium } from "@playwright/test";

/** 断言失败时抛错，中止整个验证流程 */
const assert = (condition, message) => {
  if (!condition) throw new Error(`Registry 安装验证失败：${message}`);
  console.log(`  通过：${message}`);
};

/**
 * @param url 测试项目的预览地址
 * @param screenshotPath 保存截图的位置，供人工检查
 */
export const checkInstalledButton = async (url, screenshotPath) => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url);

    const signal = page.getByRole("button", { name: "signal" });
    const colors = await signal.evaluate((el) => {
      const probe = document.createElement("div");
      probe.style.backgroundColor = "var(--signal)";
      el.after(probe);
      const expected = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { actual: getComputedStyle(el).backgroundColor, expected };
    });
    assert(colors.actual === colors.expected, "信号按钮的底色取自随组件安装的 --signal");

    await signal.click();
    await page.getByRole("button", { name: "primary" }).click();
    const loading = page.getByRole("button", { name: "loading" });
    await loading.focus();
    await page.keyboard.press("Enter");
    await loading.click({ force: true });
    const count = await page.getByTestId("count").textContent();
    assert(count === "2", "两次有效点击被计数，加载中的按钮没有触发");
    assert((await loading.getAttribute("aria-busy")) === "true", "加载中的按钮声明 aria-busy");

    await page.screenshot({ path: screenshotPath });
  } finally {
    await browser.close();
  }
};
