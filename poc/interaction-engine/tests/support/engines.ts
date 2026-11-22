/**
 * 测试共用的常量与辅助函数。
 *
 * 两个交互底座的页面遵守同一份「页面契约」：相同的可访问名称、相同的选项、
 * 相同的 data-testid。断言一律通过 ARIA 角色定位元素，因此定位本身就是对语义的检查。
 */
import type { Locator, Page } from "@playwright/test";

/** 同时实现了 Select / Combobox / Dialog 三个用例的交互底座 */
export const ENGINES = ["base-ui", "ui-sdk"] as const;

export type Engine = (typeof ENGINES)[number];

export const FRUIT_LABELS = ["Apple", "Banana", "Cherry", "Grape", "Mango"];

/** 页面上展示当前值的 <output>，受控与非受控用例都通过它观察结果 */
export const valueOutput = (page: Page): Locator => page.getByTestId("value");

/** 判断当前焦点是否位于某个元素内部，用于焦点陷阱断言 */
export const isFocusInside = (container: Locator): Promise<boolean> =>
  container.evaluate((el) => el.contains(document.activeElement));
