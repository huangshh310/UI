/**
 * Button 的文档数据：示例清单、API 表格、可访问性说明。
 */
import { ButtonDisabled } from "@/demos/button/disabled";
import { ButtonIconOnly } from "@/demos/button/icon-only";
import { ButtonLoading } from "@/demos/button/loading";
import { ButtonSignal } from "@/demos/button/signal";
import { ButtonSizes } from "@/demos/button/sizes";
import { ButtonVariants } from "@/demos/button/variants";
import { ButtonWithIcon } from "@/demos/button/with-icon";
import type { ComponentDoc } from "./registry.types";

export const BUTTON_DOC: ComponentDoc = {
  slug: "button",
  name: "Button",
  description: "触发一个操作。基于原生 button 元素，接受它的全部属性。",
  category: "buttons",
  install: "pnpm add @matt-ui/ui",
  specimens: [
    {
      slug: "variants",
      name: "视觉变体",
      description: "六种强调程度，从墨色实底到纯文字链接。",
      file: "button/variants.tsx",
      Demo: ButtonVariants,
      wide: true,
    },
    {
      slug: "signal",
      name: "信号按钮",
      description: "全系统唯一的高饱和色。一个页面只用一次，留给最重要的操作。",
      file: "button/signal.tsx",
      Demo: ButtonSignal,
    },
    {
      slug: "sizes",
      name: "尺寸",
      description: "三种带文字的尺寸。",
      file: "button/sizes.tsx",
      Demo: ButtonSizes,
    },
    {
      slug: "with-icon",
      name: "带图标",
      description: "图标作为子元素传入，尺寸自动统一为 16px。",
      file: "button/with-icon.tsx",
      Demo: ButtonWithIcon,
    },
    {
      slug: "icon-only",
      name: "纯图标",
      description: "方形按钮。没有可见文字，必须提供 aria-label。",
      file: "button/icon-only.tsx",
      Demo: ButtonIconOnly,
    },
    {
      slug: "loading",
      name: "加载状态",
      description: "加载中不可重复触发，但仍可聚焦，键盘用户不会丢失焦点。",
      file: "button/loading.tsx",
      Demo: ButtonLoading,
      wide: true,
    },
    {
      slug: "disabled",
      name: "禁用状态",
      description: "使用原生 disabled 属性。",
      file: "button/disabled.tsx",
      Demo: ButtonDisabled,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "signal"',
      defaultValue: '"primary"',
      description: "视觉变体。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "icon"',
      defaultValue: '"md"',
      description: "尺寸。icon 是只含图标的方形按钮。",
    },
    {
      name: "loading",
      type: "boolean",
      defaultValue: "false",
      description: "加载中。显示旋转指示器，并忽略点击与键盘激活。",
    },
    {
      name: "type",
      type: '"button" | "submit" | "reset"',
      defaultValue: '"button"',
      description: "默认值与原生按钮不同，放进表单不会被意外当作提交按钮。",
    },
  ],
  accessibility: [
    "焦点环只在键盘聚焦时出现，颜色取自 --ui-ring。",
    "加载中设置 aria-busy 与 aria-disabled，旋转指示器对辅助技术隐藏。",
    "用户要求减少动态效果时，旋转指示器停止旋转。",
    "纯图标按钮必须提供 aria-label。",
  ],
};
