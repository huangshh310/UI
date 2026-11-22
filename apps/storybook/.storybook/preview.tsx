/**
 * Storybook 预览配置：引入组件库的样式表，并提供浅色 / 深色主题切换。
 *
 * 组件通过 @matt-ui/ui 的公开入口引入，与真实使用者的用法一致；
 * 因此修改组件源码后需要重新构建 @matt-ui/ui，这里才会看到变化。
 */
import "@matt-ui/ui/styles.css";
import type { Decorator, Preview } from "@storybook/react-vite";

/** 用工具栏选中的主题包裹每个 Story，并铺上该主题的底色 */
const withTheme: Decorator = (Story, context) => (
  <div
    data-theme={context.globals.theme}
    style={{
      padding: 24,
      background: "var(--ui-background)",
      color: "var(--ui-foreground)",
      fontFamily: "var(--ui-font-sans)",
    }}
  >
    <Story />
  </div>
);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "组件库的主题",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
