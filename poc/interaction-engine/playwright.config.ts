/**
 * POC 的 Playwright 配置。
 *
 * 测试针对生产构建运行（next build + next start），这样 SSR 与 Hydration 的表现
 * 和真实部署一致，开发模式特有的告警不会混入结果。
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // 用例应当稳定通过，不依赖重试掩盖偶发失败
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/report.json" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      // 桌面端：键盘与鼠标
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@touch/,
    },
    {
      // 移动端：只运行标记为 @touch 的触摸用例
      name: "touch",
      use: { ...devices["Pixel 7"] },
      grep: /@touch/,
    },
  ],
  webServer: {
    command: "pnpm poc:build && pnpm poc:start",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
