import ToastBasicDemo from "@/demos/toast/basic";
import ToastTonesDemo from "@/demos/toast/tones";
import type { ComponentDoc } from "./registry.types";

export const TOAST_DOC: ComponentDoc = {
  slug: "toast",
  name: "Toast",
  description: "基于 Base UI Toast 的堆叠通知，支持多方位停靠、语义色调与撤销按钮。",
  category: "display",
  registryName: "toast",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { ToastProvider, useToast } from "@/components/ui/toast";

const { toast } = useToast();
toast({ title: "已保存", tone: "success" });`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "多语义堆叠通知",
      description: "悬停自动暂停倒计时，支持撤销操作与手动关闭。",
      file: "toast/basic.tsx",
      Demo: ToastBasicDemo,
    },
    {
      slug: "tones",
      name: "多语义状态通知堆叠",
      description: "触发成功、警告与错误三种语义 Toast，支持自动堆叠与悬停暂停消失。",
      file: "toast/tones.tsx",
      Demo: ToastTonesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "placement",
      type: '"bottom-right" | "bottom-center" | "top-right"',
      defaultValue: '"bottom-right"',
      description: "通知停靠方位",
    },
    { name: "timeout", type: "number", defaultValue: "4000", description: "自动关闭毫秒数" },
    { name: "limit", type: "number", defaultValue: "4", description: "最大同时展示数量" },
  ],
  accessibility: ["基于 Base UI Toast，内置 ARIA 播报区域，关闭按钮带有明确的无障碍名称。"],
};
