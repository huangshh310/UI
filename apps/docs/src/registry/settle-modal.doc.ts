import SettleModalBasicDemo from "@/demos/settle-modal/basic";
import SettleModalDestructiveDemo from "@/demos/settle-modal/destructive";
import SettleModalFormDemo from "@/demos/settle-modal/form";
import SettleModalSizesDemo from "@/demos/settle-modal/sizes";
import type { ComponentDoc } from "./registry.types";

export const SETTLE_MODAL_DOC: ComponentDoc = {
  slug: "settle-modal",
  name: "Settle Modal",
  description: "磨砂阻尼落位模态框，支持语义色调、标题徽章图标、四档宽度与完整焦点管理。",
  category: "overlays",
  registryName: "settle-modal",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { SettleModal } from "@/components/ui/settle-modal";

<SettleModal trigger={<button>打开</button>} title="确认发布" tone="signal">
  正文内容
</SettleModal>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "基础用法",
      description: "磨砂玻璃居中模态框，包含徽章图标、标题说明、表单输入与底部确认操作区。",
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
      description: '配合 tone="destructive"、警示图标与资源标识卡片，防止不可逆删除误触。',
      file: "settle-modal/destructive.tsx",
      Demo: SettleModalDestructiveDemo,
      directory: false,
    },
    {
      slug: "sizes",
      name: "宽度规格与对齐方式",
      description: "展示 sm / md / lg / xl 四档宽度预设，以及 xl 规格下的顶部对齐模式。",
      file: "settle-modal/sizes.tsx",
      Demo: SettleModalSizesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "open / defaultOpen",
      type: "boolean",
      defaultValue: "—",
      description: "受控或非受控打开状态",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      defaultValue: "—",
      description: "开关变化回调",
    },
    { name: "trigger", type: "ReactElement", defaultValue: "—", description: "触发打开的交互元素" },
    {
      name: "title / description",
      type: "string",
      defaultValue: "title 必填",
      description: "具名对话框标题与副标题说明",
    },
    { name: "icon", type: "ReactNode", defaultValue: "—", description: "标题左侧圆角徽章图标" },
    {
      name: "tone",
      type: '"default" | "signal" | "destructive"',
      defaultValue: '"default"',
      description: "语义边框与图标色调",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "最大宽度预设",
    },
    {
      name: "align / backdrop",
      type: '"center" | "top" / "blur" | "dim" | "transparent"',
      defaultValue: '"center" / "blur"',
      description: "弹窗垂直对齐位置与背景遮罩风格",
    },
    {
      name: "footer / showCloseButton",
      type: "ReactNode / boolean",
      defaultValue: "— / true",
      description: "底部操作栏与右上角关闭按钮",
    },
  ],
  accessibility: [
    '内置完整焦点陷阱，自动关联 role="dialog"、aria-labelledby 与背景滚动锁定。',
    "按 Escape 关闭弹窗并自动把焦点还给触发按钮，关闭按钮具备清晰的中文无障碍标签。",
  ],
};
