/**
 * TypewriterButton 的文档数据。
 */
import { TypewriterButtonBasic } from "@/demos/typewriter-button/basic";
import TypewriterButtonSilentDemo from "@/demos/typewriter-button/silent";
import type { ComponentDoc } from "./registry.types";

export const TYPEWRITER_BUTTON_DOC: ComponentDoc = {
  slug: "typewriter-button",
  name: "Typewriter Button",
  description: "点击后把文字逐字重新打出来的按钮。",
  category: "buttons",
  registryName: "typewriter-button",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  usage: `import { TypewriterButton } from "@/components/ui/typewriter-button";

export function Demo() {
  return (
    <TypewriterButton
      variant="terminal"
      prefix="$"
      label="Deploy to production"
      charDuration={60}
      onComplete={() => console.log("done")}
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "typewriter-button-basic",
      name: "逐字显示",
      description: "点击后从头打字，按钮宽度保持不变。",
      file: "typewriter-button/basic.tsx",
      Demo: TypewriterButtonBasic,
    },
    {
      slug: "silent",
      name: "信号色与静音打字机模式",
      description:
        "支持信号色、终端命令行变体与方块光标，并可通过 sound={false} 关闭机械按键音效。",
      file: "typewriter-button/silent.tsx",
      Demo: TypewriterButtonSilentDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: "-",
      description: "按钮上的文字，必填。",
    },
    {
      name: "variant",
      type: '"outline" | "primary" | "signal" | "terminal"',
      defaultValue: '"outline"',
      description: "视觉变体，terminal 提供深色终端命令行外观。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "按钮尺寸。",
    },
    {
      name: "radius",
      type: '"pill" | "default"',
      defaultValue: '"pill"',
      description: "圆角风格：胶囊圆角或标准圆角。",
    },
    {
      name: "prefix",
      type: "string",
      defaultValue: "-",
      description: "可选命令提示符前缀（如 $ 或 >），纯视觉装饰。",
    },
    {
      name: "cursorStyle",
      type: '"line" | "block"',
      defaultValue: '"line"',
      description: "打字过程中显示的光标样式：竖线或终端方块。",
    },
    {
      name: "charDuration",
      type: "number",
      defaultValue: "75",
      description: "每个字符之间的间隔，单位毫秒。",
    },
    {
      name: "autoStart",
      type: "boolean",
      defaultValue: "false",
      description: "挂载后立即开始打字。",
    },
    {
      name: "sound",
      type: "boolean",
      defaultValue: "true",
      description: "逐字显示时通过 Web Audio API 合成机械按键音效。",
    },
    {
      name: "onComplete",
      type: "() => void",
      defaultValue: "-",
      description: "全部字符显示完后调用。",
    },
  ],
  accessibility: [
    "可访问名称始终是完整的 label，屏幕阅读器不会读出零碎的字符。",
    "用户要求减少动态效果时光标不闪烁。",
  ],
};
