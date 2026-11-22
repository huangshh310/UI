/**
 * 生成给 AI 编程助手的安装提示词：把安装命令、用法和注意事项写成一段可以直接粘贴的说明。
 */
import { cliCommand } from "./registry";
import type { ComponentDoc } from "./registry.types";

export const installPrompt = (component: ComponentDoc): string =>
  [
    `请在这个项目中安装并使用 matt-ui 的 ${component.name} 组件。`,
    "",
    "1. 运行安装命令（需要项目已初始化 shadcn）：",
    `   ${cliCommand(component)}`,
    `2. 组件会被写入 components/ui/${component.registryName}.tsx，从那里引入。`,
    "3. 参考下面的用法示例：",
    "",
    component.usage,
    "",
    "注意事项：",
    ...component.accessibility.map((note) => `- ${note}`),
  ].join("\n");
