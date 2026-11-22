/**
 * 展示站的行为规约：从首页进入目录、在目录中查找示例、
 * 在详情页查看预览与源码、切换主题、复制安装命令，以及各页面的可访问性。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** 目录页中的示例卡片 */
const specimens = (page: Page) => page.getByTestId("specimen-card");

test.describe("首页", () => {
  test("主操作进入组件目录", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "浏览组件" }).click();

    await expect(page).toHaveURL(/\/components$/);
    await expect(page.getByRole("heading", { level: 1, name: "组件目录" })).toBeVisible();
  });

  test("首页上的示例是可交互的真实组件", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-slot="button"]').first()).toBeVisible();
  });
});

test.describe("组件目录", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/components");
  });

  test("列出全部示例，每张卡片里是实时渲染的组件", async ({ page }) => {
    await expect(specimens(page)).toHaveCount(7);
    await expect(specimens(page).first().locator('[data-slot="button"]').first()).toBeVisible();
  });

  test("搜索只留下名称匹配的示例", async ({ page }) => {
    await page.getByRole("searchbox", { name: "搜索组件" }).fill("加载");

    await expect(specimens(page)).toHaveCount(1);
    await expect(specimens(page).first()).toContainText("加载状态");
  });

  test("搜索没有结果时给出提示", async ({ page }) => {
    await page.getByRole("searchbox", { name: "搜索组件" }).fill("不存在的组件");

    await expect(specimens(page)).toHaveCount(0);
    await expect(page.getByText("没有匹配的示例")).toBeVisible();
  });

  test("分类页签筛选示例，并标记当前选中的分类", async ({ page }) => {
    const tab = page.getByRole("tab", { name: "按钮" });
    await tab.click();

    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect(specimens(page)).toHaveCount(7);
  });

  test("卡片上的名称链接到组件详情页的对应示例", async ({ page }) => {
    await specimens(page).first().getByRole("link").click();

    await expect(page).toHaveURL(/\/components\/button#/);
    await expect(page.getByRole("heading", { level: 1, name: "Button" })).toBeVisible();
  });
});

test.describe("组件详情页", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/components/button");
  });

  test("默认显示预览，切到代码页签后显示该示例的源码", async ({ page }) => {
    const first = page.getByTestId("specimen-block").first();
    await expect(first.locator('[data-slot="button"]').first()).toBeVisible();

    await first.getByRole("tab", { name: "代码" }).click();

    await expect(first.getByRole("tabpanel")).toContainText('from "@matt-ui/ui"');
    await expect(first.locator('[data-slot="button"]')).toHaveCount(0);
  });

  test("API 表格列出 Button 的属性", async ({ page }) => {
    const table = page.getByRole("table");

    for (const prop of ["variant", "size", "loading", "type"]) {
      await expect(table.getByRole("cell", { name: prop, exact: true })).toBeVisible();
    }
  });

  test("复制按钮把安装命令写入剪贴板", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "复制安装命令" }).click();

    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("pnpm add @matt-ui/ui");
  });

  test("加载状态示例：点击后进入加载中，期间再次点击不会重复触发", async ({ page }) => {
    const block = page.locator("#loading");
    const button = block.getByRole("button", { name: /保存/ });

    await button.click();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await button.click({ force: true });

    await expect(block.getByTestId("save-count")).toHaveText("1");
  });
});

test.describe("主题", () => {
  test("默认深色；切换后变为浅色，刷新页面仍保持", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.getByRole("button", { name: "切换主题" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });
});

test.describe("减少动态效果", () => {
  test("入场动效被关闭，内容立即可见", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/components");

    expect(
      await specimens(page)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
  });
});

test.describe("可访问性", () => {
  for (const path of ["/", "/components", "/components/button"]) {
    for (const theme of ["dark", "light"] as const) {
      test(`${path} 在${theme === "dark" ? "深色" : "浅色"}主题下没有 axe 违规`, async ({
        page,
      }) => {
        await page.addInitScript((value) => localStorage.setItem("matt-ui-theme", value), theme);
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        // 等入场动效结束：淡入过程中的半透明文字会被误判为对比度不足
        await page.waitForFunction(() =>
          document.getAnimations().every((animation) => animation.playState === "finished"),
        );

        const { violations } = await new AxeBuilder({ page }).analyze();

        expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
      });
    }
  }
});
