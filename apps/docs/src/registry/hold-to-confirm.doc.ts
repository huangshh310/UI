import HoldToConfirmBasicDemo from "@/demos/hold-to-confirm/basic";
import HoldToConfirmDestructiveDemo from "@/demos/hold-to-confirm/destructive";
import type { ComponentDoc } from "./registry.types";

export const HOLD_TO_CONFIRM_DOC: ComponentDoc = {
  slug: "hold-to-confirm",
  name: "Hold to Confirm",
  description: "C 端触感长按蓄力确认按钮，按住期间平滑填充进度，中途松手自动回弹防误触。",
  category: "buttons",
  registryName: "hold-to-confirm",
  dependencies: ["motion", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { HoldToConfirm } from "@/components/ui/hold-to-confirm";

export function Example() {
  return <HoldToConfirm label="长按部署" />;
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
  ],
  api: [
    {
      name: "label",
      type: "string",
      defaultValue: '"长按以确认执行"',
      description: "默认提示文字",
    },
    {
      name: "confirmedLabel",
      type: "string",
      defaultValue: '"已确认执行"',
      description: "完成确认后的文字",
    },
    { name: "holdDurationMs", type: "number", defaultValue: "900", description: "所需长按毫秒数" },
    {
      name: "tone",
      type: '"signal" | "destructive"',
      defaultValue: '"signal"',
      description: "进度填充色调",
    },
    { name: "onConfirm", type: "() => void", defaultValue: "—", description: "蓄力完成回调" },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "禁用状态" },
  ],
  accessibility: [
    "同时支持鼠标/触摸按住与键盘 Space / Enter 长按，遵循 WCAG 2.1 无手势绑定原则。",
    "触摸中断（pointerCancel）或失去焦点（blur）时自动取消蓄力计时，避免误触发高危操作。",
  ],
};
