/**
 * 展示站的行为规约：从首页进入目录、在目录中查找示例、
 * 在详情页查看预览与源码、切换主题、复制安装命令，以及各页面的可访问性。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const CLI_COMMAND = "pnpm dlx shadcn@latest add huangshh310/UI/button";

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

  test("「最近」页签只显示最近收录的组件，并带 NEW 标记", async ({ page }) => {
    await page.getByRole("tab", { name: "最近" }).click();

    await expect(specimens(page)).toHaveCount(7);
    await expect(specimens(page).first()).toContainText("NEW");
  });

  test("卡片上的复制按钮复制该组件的 CLI 安装命令", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await specimens(page).first().hover();
    await specimens(page)
      .first()
      .getByRole("button", { name: /复制 Button 的安装命令/ })
      .click();

    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CLI_COMMAND);
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

  test("主面板默认显示预览，「用法」是最小示例，「代码」是组件的完整源码", async ({ page }) => {
    const main = page.getByTestId("component-main");
    await expect(main.locator('[data-slot="button"]').first()).toBeVisible();

    await main.getByRole("tab", { name: "用法" }).click();
    await expect(main.getByRole("tabpanel")).toContainText('from "@/components/ui/button"');

    await main.getByRole("tab", { name: "代码" }).click();
    await expect(main.getByRole("tabpanel")).toContainText("export const Button");
  });

  test("每个示例可以在预览与它自己的源码之间切换", async ({ page }) => {
    const block = page.getByTestId("specimen-block").first();
    await expect(block.locator('[data-slot="button"]').first()).toBeVisible();

    await block.getByRole("tab", { name: "代码" }).click();

    await expect(block.getByRole("tabpanel")).toContainText('from "@/components/ui/button"');
    await expect(block.locator('[data-slot="button"]')).toHaveCount(0);
  });

  test("API 表格列出 Button 的属性", async ({ page }) => {
    const table = page.getByRole("table");

    for (const prop of ["variant", "size", "loading", "type"]) {
      await expect(table.getByRole("cell", { name: prop, exact: true })).toBeVisible();
    }
  });

  test("安装：CLI 页签可复制命令，「手动」页签列出需要的依赖", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const install = page.getByTestId("install-block");

    await install.getByRole("button", { name: "复制安装命令" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CLI_COMMAND);

    await install.getByRole("tab", { name: "手动" }).click();
    await expect(install.getByRole("tabpanel")).toContainText("class-variance-authority");
  });

  test("「复制提示词」把给 AI 助手的安装说明写入剪贴板", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "复制提示词" }).click();

    const prompt = await page.evaluate(() => navigator.clipboard.readText());
    expect(prompt).toContain(CLI_COMMAND);
    expect(prompt).toContain("Button");
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

test.describe("命令面板", () => {
  test("快捷键打开，输入后回车跳转到匹配的组件", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    const dialog = page.getByRole("dialog", { name: "搜索" });
    await expect(dialog).toBeVisible();

    await page.keyboard.type("butt");
    await expect(dialog.getByRole("option").first()).toContainText("Button");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/components\/button$/);
    await expect(dialog).toBeHidden();
  });

  test("方向键在结果之间移动，Escape 关闭并把焦点还给触发按钮", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "打开搜索" });
    await trigger.click();
    const input = page.getByRole("combobox", { name: "搜索" });
    await expect(input).toBeFocused();

    const first = await input.getAttribute("aria-activedescendant");
    await page.keyboard.press("ArrowDown");
    expect(await input.getAttribute("aria-activedescendant")).not.toBe(first);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "搜索" })).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("文档与机器可读的入口", () => {
  test("导航进入文档页，页面给出 CLI 安装方式", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name: "文档" })
      .click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toContainText("shadcn@latest add huangshh310/UI/");
  });

  test("llms.txt 与站点地图列出全部组件", async ({ request }) => {
    expect(await (await request.get("/llms.txt")).text()).toContain("/components/button");
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/components/button");
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

test.describe("窄屏", () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test("页头导航保持单行，页面没有横向溢出", async ({ page }) => {
    await page.goto("/components");
    const links = page.getByRole("navigation", { name: "主导航" }).getByRole("link");

    for (const link of await links.all()) {
      // 单行文字的链接高度不会超过 40px；换行后会明显更高
      expect((await link.boundingBox())!.height).toBeLessThan(40);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
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
  for (const path of ["/", "/components", "/components/button", "/docs"]) {
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
