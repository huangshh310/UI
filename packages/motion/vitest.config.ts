/**
 * @matt-ui/motion 的测试配置。
 * 组件测试需要 DOM，使用 jsdom；动画的视觉效果由展示站的端到端测试在真实浏览器中检查。
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
