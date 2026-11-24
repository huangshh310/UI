import ToastBasicDemo from "@/demos/toast/basic";
import ToastTonesDemo from "@/demos/toast/tones";
import type { ComponentDoc } from "./registry.types";

export const TOAST_DOC: ComponentDoc = {
  slug: "toast",
  name: "Toast",
  description: "磨砂悬浮堆叠通知系统，内置柔光状态图标、动作按钮、悬停暂停与多方位停靠。",
  category: "display",
  registryName: "toast",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { ToastProvider, useToast } from "@/components/ui/toast";

const { toast } = useToast();
toast({ title: "已保存", description: "配置已同步至云端。", tone: "success" });`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "多语义堆叠通知",
      description: "磨砂玻璃悬浮卡片，悬停自动暂停倒计时，支持撤销操作与手动关闭。",
      file: "toast/basic.tsx",
      Demo: ToastBasicDemo,
    },
    {
      slug: "tones",
      name: "多语义状态通知堆叠",
      description: "触发成功、信号、警告与错误四种语义 Toast，支持自动堆叠与悬停暂停消失。",
      file: "toast/tones.tsx",
      Demo: ToastTonesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "placement",
      type: '"bottom-right" | "bottom-center" | "top-right" | "top-center"',
      defaultValue: '"bottom-right"',
      description: "通知停靠方位",
    },
    { name: "timeout", type: "number", defaultValue: "4000", description: "自动关闭毫秒数" },
    { name: "limit", type: "number", defaultValue: "4", description: "最大同时展示数量" },
    {
      name: "toast.tone",
      type: '"default" | "signal" | "success" | "warning" | "destructive"',
      defaultValue: '"default"',
      description: "单条通知语义色调与对应状态图标",
    },
    {
      name: "toast.dismissible",
      type: "boolean",
      defaultValue: "true",
      description: "是否展示右侧关闭按钮",
    },
  ],
  accessibility: ["内置 ARIA 实时播报区域，关闭按钮带有明确的无障碍名称。"],
};
