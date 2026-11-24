import AgentScreenBasicDemo from "@/demos/agent-screen/basic";
import type { ComponentDoc } from "./registry.types";

export const AGENT_SCREEN_DOC: ComponentDoc = {
  slug: "agent-screen",
  name: "AgentScreen",
  description:
    "对标 BeautifulUI 21 Agent Screen 的智能体实时操作屏幕视口容器，支持连接中态极简加载、实况工作画面与底栏状态控制。",
  category: "ai",
  registryName: "agent-screen",
  dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
  createdAt: "2026-11-24",
  usage: `import { AgentScreen } from "@/components/ui/agent-screen";

export function Example() {
  return <AgentScreen status="loading" loadingLabel="正在连接智能体屏幕" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "智能体实时屏幕视口",
      description: "在「运行中」沙盒画面与「连接中」纯黑极简加载态间一键切换。",
      file: "agent-screen/basic.tsx",
      Demo: AgentScreenBasicDemo,
    },
  ],
  api: [
    {
      name: "status",
      type: '"working" | "loading"',
      defaultValue: '"loading"',
      description: "当前视口所处的实况工作态或建立连接加载态。",
    },
    {
      name: "title / loadingLabel / activityLabel",
      type: "string / string / string",
      defaultValue: '"智能体屏幕" / "正在连接智能体屏幕" / —',
      description: "底栏标题、连接提示文案与工作态左上角实况活动徽标。",
    },
    {
      name: "aspectRatio / actions / onStatusChange",
      type: "string / ReactNode / (status) => void",
      defaultValue: '"16 / 10" / — / —',
      description: "视口比例、底栏右侧扩展按钮与状态切换回调。",
    },
  ],
  accessibility: [
    "使用语义化 <section aria-label> 标识实时视口区域，状态切换按钮提供 aria-pressed 反馈。",
  ],
};
