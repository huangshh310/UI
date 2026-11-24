/**
 * AiSurface 的完整文档数据：多场景实时交互示例、API 契约表格与可访问性说明。
 */
import { AiSurfaceBasic } from "@/demos/ai-surface/basic";
import { AiSurfaceCustomRank } from "@/demos/ai-surface/custom-rank";
import { AiSurfaceSchemaAsk } from "@/demos/ai-surface/schema-ask";
import { AiSurfaceTextFallback } from "@/demos/ai-surface/text-fallback";
import type { ComponentDoc } from "./registry.types";

export const AI_SURFACE_DOC: ComponentDoc = {
  slug: "ai-surface",
  name: "AI Surface",
  description:
    "面向智能体的受限语义视图协议与优先级 Schema 渲染容器，内置流式增量 Patch、表单双向校验、人机协同决议闭环与零 DOM 纯文本优雅降级。",
  category: "ai",
  registryName: "ai-surface",
  dependencies: [
    "@base-ui/react",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "tailwind-merge",
  ],
  usage: `import { AiSurface } from "@/components/ui/ai-surface";

export function Example() {
  return (
    <AiSurface
      uischema={{
        main: {
          kind: "card",
          head: { title: "服务状态摘要", status: "done" },
          children: [{ kind: "badge", label: "全部健康", tone: "success" }],
        },
      }}
    />
  );
}`,
  createdAt: "2026-11-24",
  specimens: [
    {
      slug: "streaming-patch",
      name: "流式增量视图与多区看板",
      description:
        "通过 applySurfacePatch 按派生路径局部更新进度、状态与表格行，流式生成期间自动保持界面结构稳定。",
      file: "ai-surface/basic.tsx",
      Demo: AiSurfaceBasic,
    },
    {
      slug: "schema-ask",
      name: "JSON Schema 自动表单与协同决议",
      description:
        "分离数据契约与视图描述，支持声明式显隐联动规则（SurfaceRule）、流式提交防误触门控与结构化 SurfaceAnswer 回传。",
      file: "ai-surface/schema-ask.tsx",
      Demo: AiSurfaceSchemaAsk,
      directory: false,
    },
    {
      slug: "custom-rank",
      name: "rankWith 优先级接管与自定义扩展",
      description:
        "使用 rankWith 与组合谓词注册高优业务控件或 x-* 扩展节点，未注册扩展节点时自动落入零崩溃安全兜底块。",
      file: "ai-surface/custom-rank.tsx",
      Demo: AiSurfaceCustomRank,
      directory: false,
    },
    {
      slug: "text-fallback",
      name: "纯文本降级对照与模型提示词契约",
      description:
        "通过 renderSurfaceText 实时导出无损纯文本摘要用于日志归档或多轮上下文回填，并提供可直接复制给大模型的协议提示词规范。",
      file: "ai-surface/text-fallback.tsx",
      Demo: AiSurfaceTextFallback,
      directory: false,
    },
  ],
  api: [
    {
      name: "uischema",
      type: "SurfaceView",
      defaultValue: "由 schema 自动推导",
      description: "顶层语义视图描述（支持 main、dock 与 layer 三个标准区域）",
    },
    {
      name: "schema",
      type: "SurfaceDataSchema",
      defaultValue: "—",
      description: "JSON Schema 子集数据契约，驱动默认值推导、控件选型与提交前同步校验",
    },
    {
      name: "data / defaultData / onDataChange",
      type: "Record<string, unknown> / 回调",
      defaultValue: "—",
      description: "表单状态数据的受控或非受控绑定与字段级变更通知",
    },
    {
      name: "renderers",
      type: "SurfaceRendererEntry[]",
      defaultValue: "defaultSurfaceRenderers",
      description: "追加的自定义渲染器条目，按 tester 返回的 rank 分值动态优选（同分后注册者胜出）",
    },
    {
      name: "streaming / disabled",
      type: "boolean",
      defaultValue: "false",
      description: "流式构建保护开关（锁定 submit 主提交按钮防止半成品误提交）与全局禁用态",
    },
    {
      name: "onAction",
      type: "(event: SurfaceActionEvent) => void",
      defaultValue: "—",
      description: "非终结型交互事件回调（普通按钮点击、表格行点击、空状态重试等）",
    },
    {
      name: "onResolve",
      type: "(answer: SurfaceAnswer) => void",
      defaultValue: "—",
      description:
        "人机协同终结决议回调（回传 submitted 校验后数据、cancelled 取消原因或 Escape 关闭）",
    },
    {
      name: "applySurfacePatch / renderSurfaceText",
      type: "纯函数工具",
      defaultValue: "—",
      description: "基于路径派生稳定 ID 的不可变流式增量更新函数与零 DOM 纯文本降级序列化器",
    },
  ],
  accessibility: [
    "所有表单控件均通过稳定标签与 htmlFor/aria-label 关联，校验失败消息声明 role='alert' 与 aria-invalid。",
    "当视图包含 layer 浮层区域时自动挂载键盘 Escape 监听，触发 cancelled 决议关闭。",
    "流式生成期间（streaming=true）主提交按钮自动进入 aria-busy 加载禁用态，已挂载输入框保持键盘焦点不丢失。",
  ],
};
