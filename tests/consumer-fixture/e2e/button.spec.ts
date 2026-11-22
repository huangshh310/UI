/**
 * Button 在真实使用者项目中的端到端验证。
 *
 * 被测对象是从 tarball 安装的 @matt-ui/ui，运行在没有 Tailwind 的项目里。
 * 这里检查单元测试覆盖不到的部分：样式是否生效、主题是否切换、焦点环、
 * 真实的指针与键盘行为、色彩对比度。
 */
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

const panel = (page: Page, theme: "light" | "dark") => page.getByTestId(theme);

/** 元素的某个计算样式 */
const computed = (locator: Locator, property: string) =>
  locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);

/**
 * 在某个主题面板内把一个 Token 解析成浏览器的计算颜色。
 * 通过临时元素取值，这样比较的是「浏览器眼中的同一个颜色」，不受色彩空间写法影响。
 */
const resolveToken = (scope: Locator, token: string) =>
  scope.evaluate((el, name) => {
    const probe = document.createElement("div");
    probe.style.backgroundColor = `var(${name})`;
    el.append(probe);
    const color = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return color;
  }, token);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("主要按钮的底色在两个主题下分别取自各自的 --ui-primary", async ({ page }) => {
  const colors: string[] = [];
  for (const theme of ["light", "dark"] as const) {
    const scope = panel(page, theme);
    const button = scope.getByRole("button", { name: "primary", exact: true });
    const background = await computed(button, "background-color");

    expect(background).toBe(await resolveToken(scope, "--ui-primary"));
    expect(await computed(button, "color")).toBe(
      await resolveToken(scope, "--ui-primary-foreground"),
    );
    colors.push(background);
  }

  expect(colors[0]).not.toBe(colors[1]);
});

test("信号按钮在两个主题下是同一个信号色", async ({ page }) => {
  const backgrounds = await Promise.all(
    (["light", "dark"] as const).map((theme) =>
      computed(
        panel(page, theme).getByRole("button", { name: "signal", exact: true }),
        "background-color",
      ),
    ),
  );

  expect(backgrounds[0]).toBe(await resolveToken(panel(page, "light"), "--ui-signal"));
  expect(backgrounds[0]).toBe(backgrounds[1]);
});

test("键盘聚焦显示两像素的焦点环，鼠标点击不显示", async ({ page }) => {
  const scope = panel(page, "light");
  const primary = scope.getByRole("button", { name: "primary", exact: true });
  const secondary = scope.getByRole("button", { name: "secondary", exact: true });

  await page.keyboard.press("Tab");
  await expect(primary).toBeFocused();
  expect(await computed(primary, "outline-style")).toBe("solid");
  expect(await computed(primary, "outline-width")).toBe("2px");
  // 颜色带过渡，等过渡结束后再比较
  await expect
    .poll(() => computed(primary, "outline-color"))
    .toBe(await resolveToken(scope, "--ui-ring"));

  await secondary.click();
  await expect(secondary).toBeFocused();
  expect(await computed(secondary, "outline-style")).toBe("none");
});

test("悬停幽灵按钮时底色变为 accent", async ({ page }) => {
  const scope = panel(page, "light");
  const ghost = scope.getByRole("button", { name: "ghost", exact: true });

  await ghost.hover();

  await expect
    .poll(() => computed(ghost, "background-color"))
    .toBe(await resolveToken(scope, "--ui-accent"));
});

test("点击与键盘激活会触发 onClick", async ({ page }) => {
  const scope = panel(page, "light");
  const primary = scope.getByRole("button", { name: "primary", exact: true });

  await primary.click();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");

  await expect(scope.getByTestId("count")).toHaveText("3");
});

test("禁用的按钮不可点击", async ({ page }) => {
  const scope = panel(page, "light");
  const disabled = scope.getByRole("button", { name: "disabled" });

  await expect(disabled).toBeDisabled();
  await disabled.click({ force: true });

  await expect(scope.getByTestId("count")).toHaveText("0");
});

test("加载中的按钮可以聚焦，但指针与键盘都无法触发", async ({ page }) => {
  const scope = panel(page, "light");
  const loading = scope.getByRole("button", { name: "loading", exact: true });

  await expect(loading).toHaveAttribute("aria-busy", "true");
  expect(await computed(loading, "pointer-events")).toBe("none");
  await expect(loading.locator('[data-slot="button-spinner"]')).toBeVisible();

  await loading.focus();
  await expect(loading).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await loading.click({ force: true });

  await expect(scope.getByTestId("count")).toHaveText("0");
});

test("用户要求减少动态效果时，加载指示器停止旋转", async ({ page }) => {
  const spinner = panel(page, "light")
    .getByRole("button", { name: "loading", exact: true })
    .locator('[data-slot="button-spinner"]');
  expect(await computed(spinner, "animation-name")).toBe("spin");

  await page.emulateMedia({ reducedMotion: "reduce" });

  expect(await computed(spinner, "animation-name")).toBe("none");
});

test("整页在两个主题下都没有 axe 违规（含色彩对比度）", async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).analyze();

  expect(violations.map(({ id, help }) => `${id}: ${help}`)).toEqual([]);
});

test("保存整页截图，供人工检查视觉效果", async ({ page }) => {
  await page.screenshot({ path: "test-results/gallery.png", fullPage: true });
});
