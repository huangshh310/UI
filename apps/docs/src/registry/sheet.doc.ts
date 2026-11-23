import SheetBasicDemo from "@/demos/sheet/basic";
import SheetFlushDemo from "@/demos/sheet/flush";
import SheetFormDemo from "@/demos/sheet/form";
import SheetSidesDemo from "@/demos/sheet/sides";
import type { ComponentDoc } from "./registry.types";

export const SHEET_DOC: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  description:
    "默认四周圆角且与视口保留间距的磨砂悬浮抽屉，支持四方向滑入、吸顶页头/吸底页脚、图标徽章与贴边模式切换。",
  category: "overlays",
  registryName: "sheet",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { Sheet } from "@/components/ui/sheet";

<Sheet side="right" badge="LIVE" trigger={<button>详情</button>} title="节点配置">
  抽屉内容
</Sheet>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "右侧悬浮圆角抽屉",
      description: "默认启用四周 16px 圆角、磨砂背景与视口留白间距，页头与底部操作栏保持固定。",
      file: "sheet/basic.tsx",
      Demo: SheetBasicDemo,
    },
    {
      slug: "sides",
      name: "四方向悬浮弹出",
      description:
        "支持 right / left / top / bottom 四个方向平滑滑入，底部抽屉自带极简拖拽指示条。",
      file: "sheet/sides.tsx",
      Demo: SheetSidesDemo,
      directory: false,
    },
    {
      slug: "form",
      name: "成员权限表单编辑抽屉",
      description: "结合 SpringSelect 与 LockInput 构建复杂侧滑编辑工作流，底部吸底确认。",
      file: "sheet/form.tsx",
      Demo: SheetFormDemo,
      directory: false,
    },
    {
      slug: "flush",
      name: "贴边模式（inset=false）",
      description: "需要传统紧贴屏幕边缘抽屉时，传入 inset={false} 即可切换。",
      file: "sheet/flush.tsx",
      Demo: SheetFlushDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "side",
      type: '"right" | "left" | "top" | "bottom"',
      defaultValue: '"right"',
      description: "滑入方向",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg" | "xl"',
      defaultValue: '"md"',
      description: "抽屉宽度或最大高度预设",
    },
    {
      name: "inset / backdrop",
      type: 'boolean / "blur" | "dim" | "transparent"',
      defaultValue: 'true / "blur"',
      description: "悬浮留白圆角模式与背景遮罩风格",
    },
    {
      name: "title / description",
      type: "string",
      defaultValue: "title 必填",
      description: "抽屉标题与副标题说明",
    },
    {
      name: "icon / badge",
      type: "ReactNode / string",
      defaultValue: "—",
      description: "页头左侧图标徽章与标题旁状态标签",
    },
    {
      name: "footer / showCloseButton",
      type: "ReactNode / boolean",
      defaultValue: "— / true",
      description: "底部固定操作栏与关闭按钮",
    },
  ],
  accessibility: ["打开时锁定背景滚动并捕获焦点，Escape 关闭后焦点返回触发按钮。"],
};
