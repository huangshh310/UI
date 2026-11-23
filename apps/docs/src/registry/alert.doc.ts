import AlertActionableDemo from "@/demos/alert/actionable";
import AlertAppearancesDemo from "@/demos/alert/appearances";
import AlertBasicDemo from "@/demos/alert/basic";
import AlertDismissibleDemo from "@/demos/alert/dismissible";
import type { ComponentDoc } from "./registry.types";

export const ALERT_DOC: ComponentDoc = {
  slug: "alert",
  name: "Alert",
  description:
    "语义状态提示组件，支持柔和底色、左侧强调条、实色高强调与通栏横幅四种形态，内置图标与可关闭交互。",
  category: "display",
  registryName: "alert",
  dependencies: ["class-variance-authority", "lucide-react"],
  usage: `import { Alert } from "@/components/ui/alert";

<Alert variant="info" appearance="accent" title="校验已通过" description="全部测试均为绿色。" />`,
  createdAt: "2026-11-22",
  specimens: [
    {
      slug: "basic",
      name: "信息与可关闭警告",
      description: "支持 neutral / info / success / warning / destructive 五种语义。",
      file: "alert/basic.tsx",
      Demo: AlertBasicDemo,
    },
    {
      slug: "actionable",
      name: "带即时操作按钮的升级横幅",
      description: "通过 action 插槽嵌入主按钮，点击后动态切换横幅语义与状态文案。",
      file: "alert/actionable.tsx",
      Demo: AlertActionableDemo,
      directory: false,
    },
    {
      slug: "dismissible",
      name: "可关闭维护通知横幅",
      description: "传入 onDismiss 自动启用右侧关闭按钮，支持用户手动收起系统公告。",
      file: "alert/dismissible.tsx",
      Demo: AlertDismissibleDemo,
      directory: false,
    },
    {
      slug: "appearances",
      name: "四种视觉呈现形态",
      description: "对比 accent 左侧强调条、soft 柔和底色、solid 实色与 banner 通栏公告样式。",
      file: "alert/appearances.tsx",
      Demo: AlertAppearancesDemo,
      directory: false,
    },
  ],
  api: [
    {
      name: "variant",
      type: '"neutral" | "info" | "success" | "warning" | "destructive"',
      defaultValue: '"info"',
      description: "语义级别",
    },
    {
      name: "appearance",
      type: '"soft" | "accent" | "solid" | "banner"',
      defaultValue: '"soft"',
      description: "视觉呈现形态（柔和底色 / 左侧强调条 / 实色 / 通栏横幅）",
    },
    { name: "title", type: "string", defaultValue: "必填", description: "标题文案" },
    { name: "description", type: "ReactNode", defaultValue: "—", description: "补充说明内容" },
    { name: "icon", type: "ReactNode", defaultValue: "—", description: "自定义左侧图标" },
    { name: "action", type: "ReactNode", defaultValue: "—", description: "右侧操作槽" },
    {
      name: "dismissible",
      type: "boolean",
      defaultValue: "false",
      description: "是否显示关闭按钮（传入 onDismiss 时默认自动开启）",
    },
  ],
  accessibility: ['warning 与 destructive 变体自动附带 role="alert"，辅助技术可即时播报重要告警。'],
};
