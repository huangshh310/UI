/**
 * 展示站的 Playwright 配置。针对生产构建运行。
 */
import { defineConfig, devices } from "@playwright/test";

const PORT = 3300;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  // CI 中额外使用 github 报告器：失败的用例会成为检查结果上的批注，不必下载日志就能看到原因
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/report.json" }],
    ...(process.env.CI ? ([["github"]] as const) : []),
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm build && pnpm start",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
