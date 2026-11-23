import HoldToConfirmBasicDemo from "@/demos/hold-to-confirm/basic";
import HoldToConfirmDestructiveDemo from "@/demos/hold-to-confirm/destructive";
import HoldToConfirmVariantsDemo from "@/demos/hold-to-confirm/variants";
import type { ComponentDoc } from "./registry.types";

export const HOLD_TO_CONFIRM_DOC: ComponentDoc = {
  slug: "hold-to-confirm",
  name: "Hold to Confirm",
  description: "C 端触感长按蓄力确认按钮，按住期间平滑填充进度，中途松手自动回弹防误触。",
  category: "buttons",
  registryName: "hold-to-confirm",
  dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
  createdAt: "2026-11-22",
  usage: `import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export function Example() {
  return (
    <HoldToConfirm
      variant="solid"
      tone="emerald"
      label="长按部署"
      confirmedLabel="已部署"
    />
  );
}`,
  specimens: [
    {
      slug: "basic",
      name: "长按蓄力填充确认",
      description: "按住按钮（或聚焦后按住空格/回车）达到设定时长后触发确认，松手即刻回弹。",
      file: "hold-to-confirm/basic.tsx",
      Demo: HoldToConfirmBasicDemo,
    },
    {
      slug: "destructive",
      name: "高危操作色调与自定义蓄力时长",
      description: "对比 destructive 警示色调与不同 holdDurationMs 蓄力阈值。",
      file: "hold-to-confirm/destructive.tsx",
      Demo: HoldToConfirmDestructiveDemo,
      directory: false,
    },
    {
      slug: "variants",
      name: "实底、描边变体与多色调",
      description: "提供 solid / surface / outline 三种材质、emerald 成功色调与标准圆角组合。",
      file: "hold-to-confirm/variants.tsx",
      Demo: HoldToConfirmVariantsDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: '"长按以确认执行"',
      description: "默认提示文字。",
    },
    {
      name: "confirmedLabel",
      type: "string",
      defaultValue: '"已确认执行"',
      description: "完成确认后的文字。",
    },
    {
      name: "holdDurationMs",
      type: "number",
      defaultValue: "900",
      description: "所需长按毫秒数。",
    },
    {
      name: "tone",
      type: '"signal" | "destructive" | "emerald"',
      defaultValue: '"signal"',
      description: "进度填充与确认后的语义色调。",
    },
    {
      name: "variant",
      type: '"surface" | "solid" | "outline"',
      defaultValue: '"surface"',
      description: "底面视觉变体。",
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
      description: "圆角风格：胶囊圆角或标准大圆角。",
    },
    {
      name: "icon",
      type: "ReactNode",
      defaultValue: "-",
      description: "未确认状态的可选前置图标。",
    },
    {
      name: "showReset",
      type: "boolean",
      defaultValue: "true",
      description: "确认后是否显示右侧重置按钮。",
    },
    { name: "onConfirm", type: "() => void", defaultValue: "—", description: "蓄力完成回调。" },
    {
      name: "onReset",
      type: "() => void",
      defaultValue: "—",
      description: "点击重置按钮后的回调。",
    },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "禁用状态。" },
  ],
  accessibility: [
    "同时支持鼠标/触摸按住与键盘 Space / Enter 长按，遵循 WCAG 2.1 无手势绑定原则。",
    "触摸中断（pointerCancel）或失去焦点（blur）时自动取消蓄力计时，避免误触发高危操作。",
    "确认完成后通过 aria-live 播报结果给屏幕阅读器。",
  ],
};
