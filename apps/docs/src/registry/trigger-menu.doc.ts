/**
 * TriggerMenu 的文档数据：多触发符光标锚定检索菜单与 PromptInput 挂载说明。
 */
import { TriggerMenuBasic } from "@/demos/trigger-menu/basic";
import { TriggerMenuPromptComposer } from "@/demos/trigger-menu/prompt-composer";
import type { ComponentDoc } from "./registry.types";

export const TRIGGER_MENU_DOC: ComponentDoc = {
  slug: "trigger-menu",
  name: "Trigger Menu",
  description:
    "光标锚定多触发符检索浮层，支持 @ 文件引用、/ 斜杠指令补全，并可直接包裹 PromptInput 实现零侵入挂载。",
  category: "ai",
  registryName: "trigger-menu",
  dependencies: [
    "@ui-sdk/react@0.1.0-beta.13",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { PromptInput } from "@/components/ui/prompt-input";
import { TriggerMenu } from "@/components/ui/trigger-menu";

export function Example() {
  return (
    <TriggerMenu triggers={[{ char: "@", items: [{ value: "schema.ts", label: "schema.ts" }] }]}>
      <PromptInput placeholder="键入 @ 引用工作区文件…" />
    </TriggerMenu>
  );
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "prompt-composer",
      name: "挂载 PromptInput 光标浮层",
      description:
        "零侵入包裹 PromptInput，实时追踪光标弹出 @文件 与 /指令 候选菜单，回车优先补全指令。",
      file: "trigger-menu/prompt-composer.tsx",
      Demo: TriggerMenuPromptComposer,
    },
    {
      slug: "basic",
      name: "内置多触发符文本框",
      description: "省略子元素时渲染内置输入区，同时监听 @ 文件与 # 标签触发规则。",
      file: "trigger-menu/basic.tsx",
      Demo: TriggerMenuBasic,
      directory: false,
    },
  ],
  api: [
    {
      name: "triggers",
      type: "TriggerMenuSource[]",
      defaultValue: "必填",
      description: "触发符、匹配边界与候选项定义列表",
    },
    {
      name: "children",
      type: "ReactNode",
      defaultValue: "—",
      description: "包裹自定义输入器（如 PromptInput）时自动绑定其内部输入元素",
    },
    {
      name: "onSelect",
      type: "(payload: TriggerMenuSelectPayload) => void",
      defaultValue: "—",
      description: "选中候选建议并完成插入后的回调",
    },
    {
      name: "multiline",
      type: "boolean",
      defaultValue: "true",
      description: "内置输入模式下是否使用多行文本域",
    },
  ],
  accessibility: [
    "输入框保持焦点不变，通过 aria-activedescendant 与 aria-controls 同步浮层高亮项，支持上下方向键切换、Enter 确认与 Escape 关闭。",
    '内置隐藏的实时状态播报区（role="status"），向屏幕阅读器播报当前匹配建议数量。',
  ],
};
