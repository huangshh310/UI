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
  dependencies: ["clsx", "tailwind-merge"],
  usage: `import { TypewriterButton } from "@/components/ui/typewriter-button";

export function Demo() {
  return (
    <TypewriterButton
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
      description: "支持切换视觉变体，并通过 sound={false} 关闭机械键盘音效。",
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
