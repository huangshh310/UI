/**
 * Storybook 主配置：声明 Stories 的位置、使用的框架与插件。
 */
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  // a11y 插件在每个 Story 上运行 axe，结果显示在面板中
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    // 不向 Storybook 上报使用数据
    disableTelemetry: true,
  },
};

export default config;
