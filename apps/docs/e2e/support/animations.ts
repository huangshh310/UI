/**
 * 等页面上的一次性动画结束。
 *
 * 入场动效进行中，半透明的文字会被 axe 误判为对比度不足，所以扫描前要等它们结束。
 * 无限循环的动画（旋转的边缘光、加载指示器）永远不会结束，这里不等它们。
 */
import type { Page } from "@playwright/test";

export const waitForEntranceAnimations = (page: Page) =>
  page.waitForFunction(() =>
    document
      .getAnimations()
      .every(
        (animation) =>
          animation.playState === "finished" ||
          animation.effect?.getComputedTiming().iterations === Infinity,
      ),
  );
