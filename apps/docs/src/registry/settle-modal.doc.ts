import SettleModalBasicDemo from "@/demos/settle-modal/basic";
import SettleModalFormDemo from "@/demos/settle-modal/form";
import SettleModalDestructiveDemo from "@/demos/settle-modal/destructive";
import type { ComponentDoc } from "./registry.types";

export const SETTLE_MODAL_DOC: ComponentDoc = {
  slug: "settle-modal",
  name: "Settle Modal",
  description: "基于 Base UI Dialog 的居中模态框，带阻尼落位入场/退场与焦点陷阱。",
  category: "overlays",
  registryName: "settle-modal",
  dependencies: ["@base-ui/react", "lucide-react"],
  usage: `import { SettleModal } from "@/components/ui/settle-modal";

<SettleModal trigger={<button>打开</button>} title="确认发布">
  正文内容
</SettleModal>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "基础用法",
      description: "居中模态框，包含标题、说明、表单输入与底部确认操作区。",
      file: "settle-modal/basic.tsx",
      Demo: SettleModalBasicDemo,
    },
    {
      slug: "form",
      name: "表单新建弹层",
      description: "结合输入框与下拉选择器的居中表单对话框，底部放置取消与确认动作。",
      file: "settle-modal/form.tsx",
      Demo: SettleModalFormDemo,
      directory: false,
    },
    {
      slug: "destructive",
      name: "高危操作二次确认",
      description: "配合 destructive 按钮与资源标识卡片，防止不可逆删除误触。",
      file: "settle-modal/destructive.tsx",
      Demo: SettleModalDestructiveDemo,
      directory: false,
    },
  ],
  api: [
    { name: "open", type: "boolean", defaultValue: "—", description: "受控打开状态" },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      defaultValue: "—",
      description: "开关变化回调",
    },
    { name: "trigger", type: "ReactElement", defaultValue: "—", description: "触发打开的交互元素" },
    { name: "title", type: "string", defaultValue: "必填", description: "具名对话框标题" },
    { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "最大宽度预设" },
  ],
  accessibility: [
    '基于 Base UI Dialog，提供 role="dialog"、aria-labelledby 与滚动锁定。',
    "按 Escape 关闭弹窗并自动把焦点还给触发按钮。",
  ],
};
