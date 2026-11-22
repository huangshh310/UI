/**
 * @matt-ui/motion 在真实使用者项目中的端到端验证。
 *
 * 被测对象是从 tarball 安装的 @matt-ui/motion，运行在没有 Tailwind 的项目里，
 * 样式来自 @matt-ui/motion/styles.css。检查样式生效、主题切换、焦点环与真实交互。
 */
import { expect, test, type Locator, type Page } from "@playwright/test";

const panel = (page: Page, theme: "light" | "dark") => page.getByTestId(theme);

const computed = (locator: Locator, property: string) =>
  locator.evaluate((el, name) => getComputedStyle(el).getPropertyValue(name), property);

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

test("MagneticButton 在两个主题下取用各自的 --ui-primary，悬停产生位移，点击触发回调", async ({
  page,
}) => {
  for (const theme of ["light", "dark"] as const) {
    const scope = panel(page, theme);
    const button = scope.getByRole("button", { name: "magnetic", exact: true });
    expect(await computed(button, "background-color")).toBe(
      await resolveToken(scope, "--ui-primary"),
    );
  }

  const scope = panel(page, "light");
  const wrapper = scope.locator('[data-slot="magnetic-button"]');
  const box = (await wrapper.boundingBox())!;
  await page.mouse.move(box.x + box.width - 4, box.y + box.height - 4, { steps: 4 });
  await expect
    .poll(() => computed(wrapper, "transform"))
    .not.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

  await scope.getByRole("button", { name: "magnetic", exact: true }).click();
  await expect(scope.getByTestId("count")).toHaveText("1");
});

test("MorphingButton 点击后依次进入处理中与成功状态，成功态使用信号色", async ({ page }) => {
  const scope = panel(page, "light");
  await scope.getByRole("button", { name: "Save changes" }).click();

  const saved = scope.getByRole("button", { name: "Saved" });
  await expect(saved).toBeVisible();
  await expect
    .poll(() => computed(saved, "background-color"))
    .toBe(await resolveToken(scope, "--ui-signal"));
});

test("LiquidToggle 切换后轨道变为信号色，键盘聚焦显示焦点环", async ({ page }) => {
  const scope = panel(page, "light");
  const toggle = scope.getByRole("switch", { name: "notifications" });
  expect(await computed(toggle, "background-color")).toBe(await resolveToken(scope, "--ui-input"));

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await expect
    .poll(() => computed(toggle, "background-color"))
    .toBe(await resolveToken(scope, "--ui-signal"));

  // 从前一个可聚焦控件 Tab 到开关，确认 focus-visible 生效
  await scope.getByRole("button", { name: /slide to delete/ }).focus();
  await page.keyboard.press("Tab");
  await expect(toggle).toBeFocused();
  expect(await computed(toggle, "outline-style")).toBe("solid");
  expect(await computed(toggle, "outline-width")).toBe("2px");
});

test("DragToConfirm 样式生效，键盘 Enter 可确认并触发回调", async ({ page }) => {
  const scope = panel(page, "light");
  const track = scope.locator('[data-slot="drag-to-confirm"]');
  const handle = scope.getByRole("button", { name: /slide to delete/ });

  expect((await track.boundingBox())!.width).toBeGreaterThan(200);
  await handle.focus();
  await page.keyboard.press("Enter");

  await expect(track).toHaveAttribute("data-confirmed", "");
  await expect(scope.getByTestId("confirmed-count")).toHaveText("1");
});
