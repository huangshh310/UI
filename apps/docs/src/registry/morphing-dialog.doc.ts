import MorphingDialogBasicDemo from "@/demos/morphing-dialog/basic";
import MorphingDialogGalleryDemo from "@/demos/morphing-dialog/gallery";
import MorphingDialogReleaseDemo from "@/demos/morphing-dialog/release";
import type { ComponentDoc } from "./registry.types";

export const MORPHING_DIALOG_DOC: ComponentDoc = {
  slug: "morphing-dialog",
  name: "Morphing Dialog",
  description:
    "共享 layoutId 磨砂卡片形变对话框，结合 Base UI 焦点陷阱与 motion 弹簧布局过渡，支持语义标签、徽章图标与三档宽度。",
  category: "overlays",
  registryName: "morphing-dialog",
  dependencies: ["@base-ui/react", "lucide-react", "motion"],
  usage: `import { MorphingDialog } from "@/components/ui/morphing-dialog";

<MorphingDialog title="边缘节点" subtitle="东京" tag="运行中" tagTone="success">
  详情内容
</MorphingDialog>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "卡片展开形变",
      description: "点击摘要卡片无缝展开为磨砂详情弹窗，系统开启减弱动效时自动平滑回退。",
      file: "morphing-dialog/basic.tsx",
      Demo: MorphingDialogBasicDemo,
    },
    {
      slug: "release",
      name: "更新日志形变详情卡",
      description: '点击紧凑摘要卡片平滑形变为宽幅（size="lg"）发版说明与升级操作弹层。',
      file: "morphing-dialog/release.tsx",
      Demo: MorphingDialogReleaseDemo,
      directory: false,
    },
    {
      slug: "gallery",
      name: "多卡网格独立形变",
      description: "每张卡片拥有独立 layoutId 与语义色调标签，可分别平滑展开查看明细。",
      file: "morphing-dialog/gallery.tsx",
      Demo: MorphingDialogGalleryDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "title / subtitle",
      type: "string",
      defaultValue: "title 必填",
      description: "共享过渡标题与副标题",
    },
    {
      name: "tag / tagTone",
      type: 'string / "neutral" | "signal" | "success" | "warning"',
      defaultValue: '— / "neutral"',
      description: "顶部状态胶囊标签与语义色调",
    },
    {
      name: "icon / meta",
      type: "ReactNode / string",
      defaultValue: "—",
      description: "头部徽章图标与触发卡片底部摘要元信息",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "展开后弹窗的最大宽度预设",
    },
    { name: "footer", type: "ReactNode", defaultValue: "—", description: "展开后底部操作区" },
  ],
  accessibility: [
    "遵守 prefers-reduced-motion，且完整继承 Base UI Dialog 的焦点管理与 Escape 关闭。",
  ],
};
