import MorphingDialogBasicDemo from "@/demos/morphing-dialog/basic";
import MorphingDialogReleaseDemo from "@/demos/morphing-dialog/release";
import type { ComponentDoc } from "./registry.types";

export const MORPHING_DIALOG_DOC: ComponentDoc = {
  slug: "morphing-dialog",
  name: "Morphing Dialog",
  description: "共享 layoutId 卡片形变对话框，结合 Base UI 焦点陷阱与 motion 弹簧布局过渡。",
  category: "overlays",
  registryName: "morphing-dialog",
  dependencies: ["@base-ui/react", "lucide-react", "motion"],
  usage: `import { MorphingDialog } from "@/components/ui/morphing-dialog";

<MorphingDialog title="边缘节点" subtitle="东京">详情内容</MorphingDialog>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "卡片展开形变",
      description: "点击摘要卡片无缝展开为详情弹窗，系统开启减弱动效时自动平滑回退。",
      file: "morphing-dialog/basic.tsx",
      Demo: MorphingDialogBasicDemo,
    },
    {
      slug: "release",
      name: "更新日志形变详情卡",
      description: "点击紧凑摘要卡片平滑形变为完整发版说明与升级操作弹层。",
      file: "morphing-dialog/release.tsx",
      Demo: MorphingDialogReleaseDemo,
      directory: false,
    },
  ],
  api: [
    { name: "title", type: "string", defaultValue: "必填", description: "共享过渡标题" },
    { name: "subtitle", type: "string", defaultValue: "—", description: "副标题" },
    { name: "tag", type: "string", defaultValue: "—", description: "顶部钴蓝状态标签" },
    { name: "footer", type: "ReactNode", defaultValue: "—", description: "展开后底部操作区" },
  ],
  accessibility: [
    "遵守 prefers-reduced-motion，且完整继承 Base UI Dialog 的焦点管理与 Escape 关闭。",
  ],
};
