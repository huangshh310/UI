import SheetBasicDemo from "@/demos/sheet/basic";
import SheetFlushDemo from "@/demos/sheet/flush";
import SheetFormDemo from "@/demos/sheet/form";
import SheetSidesDemo from "@/demos/sheet/sides";
import type { ComponentDoc } from "./registry.types";

export const SHEET_DOC: ComponentDoc = {
  slug: "sheet",
  name: "Sheet",
  description:
    "默认四周圆角且与视口保留间距的悬浮抽屉，支持四方向滑入、吸顶页头/吸底页脚与贴边模式切换。",
  category: "overlays",
  registryName: "sheet",
  dependencies: ["@base-ui/react", "class-variance-authority", "lucide-react"],
  usage: `import { Sheet } from "@/components/ui/sheet";

<Sheet side="right" trigger={<button>详情</button>} title="节点配置">
  抽屉内容
</Sheet>`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "右侧悬浮圆角抽屉",
      description: "默认启用四周 16px 圆角与视口留白间距，页头与底部操作栏保持固定。",
      file: "sheet/basic.tsx",
      Demo: SheetBasicDemo,
    },
    {
      slug: "sides",
      name: "四方向悬浮弹出",
      description: "支持 right / left / top / bottom 四个方向平滑滑入，统一保持悬浮留白层次。",
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
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "抽屉宽度或高度预设",
    },
    {
      name: "inset",
      type: "boolean",
      defaultValue: "true",
      description: "是否启用四周圆角并保留上下及侧边悬浮间距",
    },
    { name: "title", type: "string", defaultValue: "必填", description: "抽屉标题" },
    { name: "footer", type: "ReactNode", defaultValue: "—", description: "底部固定操作栏" },
  ],
  accessibility: ["打开时锁定背景滚动并捕获焦点，Escape 关闭后焦点返回触发按钮。"],
};
