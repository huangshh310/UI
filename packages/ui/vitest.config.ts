/**
 * @matt-ui/ui 的测试配置。
 * 组件测试需要 DOM，使用 jsdom；样式与真实浏览器行为由消费方验证项目的端到端测试覆盖。
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
