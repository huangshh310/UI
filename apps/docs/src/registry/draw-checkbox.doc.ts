/**
 * Draw Checkbox 的文档数据。
 */
import { DrawCheckboxBasic } from "@/demos/draw-checkbox/basic";
import { DrawCheckboxCards } from "@/demos/draw-checkbox/cards";
import { DrawCheckboxChecklist } from "@/demos/draw-checkbox/checklist";
import DrawCheckboxGroupDemo from "@/demos/draw-checkbox/group";
import { DrawCheckboxPills } from "@/demos/draw-checkbox/pills";
import { DrawCheckboxStyles } from "@/demos/draw-checkbox/styles";
import type { ComponentDoc } from "./registry.types";

export const DRAW_CHECKBOX_DOC: ComponentDoc = {
  slug: "draw-checkbox",
  name: "Draw Checkbox",
  description:
    "基于 Base UI Checkbox，勾选时对勾沿 SVG 路径平滑绘制出来的复选框；支持 C 端卡片选项、胶囊标签、轻盈列表行、圆形几何与待办划线动效。",
  category: "forms",
  registryName: "draw-checkbox",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "lucide-react",
    "clsx",
    "tailwind-merge",
  ],
  usage: `import { DrawCheckbox } from "@/components/ui/draw-checkbox";

export function Demo() {
  return (
    <DrawCheckbox
      variant="card"
      shape="circle"
      tone="signal"
      controlPosition="right"
      label="开启云端自动同步"
      description="实时备份项目快照并支持随时回滚。"
      defaultChecked
    />
  );
}`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "draw-checkbox-basic",
      name: "路径绘制勾选",
      description: "支持默认墨色、信号色高亮与半选（indeterminate）状态。",
      file: "draw-checkbox/basic.tsx",
      Demo: DrawCheckboxBasic,
    },
    {
      slug: "cards",
      name: "C 端服务卡片与订阅加购",
      description:
        "卡片变体搭配圆形勾选、右侧控件排布、图标容器、推荐徽章与实时价格汇总，适合套餐与增值服务选择。",
      file: "draw-checkbox/cards.tsx",
      Demo: DrawCheckboxCards,
      directory: false,
    },
    {
      slug: "pills",
      name: "兴趣偏好与筛选胶囊",
      description: "胶囊标签（pill）变体带轻盈按压弹性，适合引导页兴趣多选与内容筛选。",
      file: "draw-checkbox/pills.tsx",
      Demo: DrawCheckboxPills,
      directory: false,
    },
    {
      slug: "checklist",
      name: "待办清单与划线完成态",
      description:
        "tile 列表行配合圆形勾选与 strikethrough 划线淡出效果，搭配顶部完成进度条呈现清脆的 C 端清单体验。",
      file: "draw-checkbox/checklist.tsx",
      Demo: DrawCheckboxChecklist,
      directory: false,
    },
    {
      slug: "styles",
      name: "形状、尺寸、语义色与协议校验",
      description: "涵盖方角/圆角/全圆三种几何、三档尺寸、破坏性警示色、禁用态与错误提示校验。",
      file: "draw-checkbox/styles.tsx",
      Demo: DrawCheckboxStyles,
      directory: false,
    },
    {
      slug: "group",
      name: "半选态全选分组清单",
      description: "父级复选框随子项勾选自动在全选、半选与未选间切换，配品牌蓝信号色与计数。",
      file: "draw-checkbox/group.tsx",
      Demo: DrawCheckboxGroupDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"default" | "card" | "pill" | "tile"',
      defaultValue: '"default"',
      description: "容器外观：行内默认、C 端服务卡片、胶囊标签或轻盈列表行。",
    },
    {
      name: "shape",
      type: '"rounded" | "circle" | "square"',
      defaultValue: '"rounded"',
      description: "复选框几何形状：柔润圆角、全圆（iOS/Things 风格）或利落方角。",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      defaultValue: '"md"',
      description: "复选框与标签文案的尺寸规格。",
    },
    {
      name: "tone",
      type: '"primary" | "signal" | "destructive"',
      defaultValue: '"primary"',
      description: "勾选态语义底色（墨色、品牌蓝或警示红）。",
    },
    {
      name: "controlPosition",
      type: '"left" | "right"',
      defaultValue: '"left"',
      description: "复选框位于文案左侧或右侧（卡片与设置行常用 right）。",
    },
    {
      name: "label / description",
      type: "string",
      defaultValue: "-",
      description: "复选框旁的标签文字与下方补充说明。",
    },
    {
      name: "icon / badge / trailing",
      type: "ReactNode",
      defaultValue: "-",
      description: "扩展插槽：左侧图标、标签旁推荐徽章与右侧价格/时间等附加信息。",
    },
    {
      name: "strikethrough",
      type: "boolean",
      defaultValue: "false",
      description: "待办清单划线模式：勾选后文案柔和淡出并添加删除线。",
    },
    {
      name: "error",
      type: "string",
      defaultValue: "-",
      description: "错误校验提示；传入后声明 aria-invalid 并通过 role=alert 关联播报。",
    },
    {
      name: "checked / defaultChecked",
      type: "boolean",
      defaultValue: "false",
      description: "受控或非受控勾选状态。",
    },
    {
      name: "indeterminate",
      type: "boolean",
      defaultValue: "false",
      description: '半选态，声明 aria-checked="mixed"。',
    },
    {
      name: "onCheckedChange",
      type: "(checked: boolean) => void",
      defaultValue: "-",
      description: "状态变化回调。",
    },
  ],
  accessibility: [
    "交互与隐藏表单输入由 Base UI Checkbox 提供，支持点击整卡/标签与空格键切换。",
    '半选状态正确声明 aria-checked="mixed"，错误态通过 aria-invalid 与 role="alert" 通知辅助技术。',
    "减少动态效果时路径绘制与按压缩放过渡自动压缩，不依赖动画传达状态。",
  ],
};
