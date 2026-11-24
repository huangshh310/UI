/**
 * AiSurfaceAgent 的完整文档数据：智能体领域语义渲染示例、API 表格与无障碍说明。
 */
import { AiSurfaceAgentBasic } from "@/demos/ai-surface-agent/basic";
import { AiSurfaceAgentDataUpgrade } from "@/demos/ai-surface-agent/data-upgrade";
import { AiSurfaceAgentKnowledge } from "@/demos/ai-surface-agent/knowledge-workspace";
import type { ComponentDoc } from "./registry.types";

export const AI_SURFACE_AGENT_DOC: ComponentDoc = {
  slug: "ai-surface-agent",
  name: "AI Surface Agent",
  description:
    "智能体高阶领域语义渲染包：在核心语义视图协议之上预装 rank 5 领域渲染器，开箱桥接敏感操作审批、代码差异审阅、工具调用轨迹、生成产物画布、知识引用溯源、层级树与可检索数据表。",
  category: "ai",
  registryName: "ai-surface-agent",
  dependencies: ["clsx", "tailwind-merge"],
  usage: `import { AiSurfaceAgent } from "@/components/ui/ai-surface-agent";

export function Example() {
  return (
    <AiSurfaceAgent
      uischema={{
        main: {
          kind: "tool-call",
          toolName: "verify_surface_schema",
          status: "done",
          summary: "已完成语义节点契约校验",
        },
      }}
    />
  );
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "approval-diff",
      name: "人机协同审批护栏与代码差异审阅",
      description:
        "组合 tool-call、diff 与 approval 语义节点，自动将授权批准与拒绝映射为结构化 SurfaceAnswer。",
      file: "ai-surface-agent/basic.tsx",
      Demo: AiSurfaceAgentBasic,
    },
    {
      slug: "knowledge-workspace",
      name: "生成产物画布、知识溯源与拓扑树",
      description:
        "在主视图与侧栏分区协同渲染 artifact 代码画布、citation 引用卡片与 tree 层级导航。",
      file: "ai-surface-agent/knowledge-workspace.tsx",
      Demo: AiSurfaceAgentKnowledge,
      directory: false,
    },
    {
      slug: "data-upgrade",
      name: "高阶检索数据表与组合框自动升权",
      description:
        "带搜索或排序特征的 table 自动升级为 DataTable，controlType='combobox' 或长枚举自动升级为可搜索 Combobox。",
      file: "ai-surface-agent/data-upgrade.tsx",
      Demo: AiSurfaceAgentDataUpgrade,
      directory: false,
    },
  ],
  api: [
    {
      name: "uischema / schema",
      type: "SurfaceView / SurfaceDataSchema",
      defaultValue: "—",
      description: "完全继承 AiSurface 的语义视图协议与 JSON Schema 数据契约",
    },
    {
      name: "agentSurfaceRenderers",
      type: "SurfaceRendererEntry[]",
      defaultValue: "内置 8 项 (rank 5)",
      description:
        "导出的智能体领域渲染器列表，也可按需挑选子集传入基础 AiSurface 的 renderers 属性",
    },
    {
      name: "renderers",
      type: "SurfaceRendererEntry[]",
      defaultValue: "—",
      description: "追加在 agentSurfaceRenderers 之后的业务自定义渲染器（rank >= 5 即可接管覆盖）",
    },
    {
      name: "onAction / onResolve",
      type: "回调函数",
      defaultValue: "—",
      description: "统一接收差异采纳、工具重试、树节点选择动作以及审批卡片的提交/拒绝决议",
    },
  ],
  accessibility: [
    "审批护栏策略项具备独立 aria-pressed 语义，代码差异行复选框附带行号无障碍标签。",
    "层级树遵循 tree / treeitem 键盘方向键规范，组合框与检索数据表均保持单层高对比焦点环。",
  ],
};
