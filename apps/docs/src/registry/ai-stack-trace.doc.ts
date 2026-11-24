import AiStackTraceBasicDemo from "@/demos/ai-stack-trace/basic";
import type { ComponentDoc } from "./registry.types";

export const AI_STACK_TRACE_DOC: ComponentDoc = {
  slug: "ai-stack-trace",
  name: "AI Stack Trace",
  description:
    "对标 HextaUI Stack Trace 的智能体错误堆栈与源码上下文面板，支持命令退出码条、高亮出错代码行、框架帧折叠归组、Caused by 根因链与一键请求修复。",
  category: "ai",
  registryName: "ai-stack-trace",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-24",
  usage: `import { AiStackTrace } from "@/components/ui/ai-stack-trace";

export function Example() {
  return <AiStackTrace />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "命令退出码、出错源码高亮与根因链",
      description:
        "还原智能体调用接口失败后的堆栈排查视图，支持展开折叠框架帧、复制代码或堆栈以及点击“请求修复”将错误交给 AI 处理。",
      file: "ai-stack-trace/basic.tsx",
      Demo: AiStackTraceBasicDemo,
    },
  ],
  api: [
    {
      name: "command",
      type: "AiStackCommand | null",
      defaultValue: "内置 curl 示例",
      description: "顶部命令执行行（命令文本、退出码与耗时），传 null 隐藏",
    },
    {
      name: "errorName / errorMessage",
      type: "string",
      defaultValue: '"TypeError" / "fetch failed"',
      description: "主错误类型名与错误描述",
    },
    {
      name: "frames",
      type: "AiStackFrame[]",
      defaultValue: "内置堆栈帧与源码片段",
      description: "调用栈帧列表，支持 framework 标记与内嵌 snippet 源码高亮",
    },
    {
      name: "cause",
      type: "AiStackCause | null",
      defaultValue: "ECONNREFUSED 示例",
      description: "底部 Caused by 底层根因信息",
    },
    {
      name: "onAskFix / onCopy",
      type: "回调",
      defaultValue: "—",
      description: "点击“请求修复”或“复制错误堆栈”时触发",
    },
  ],
  accessibility: [
    "命令栏折叠按钮、框架帧展开按钮均暴露 aria-expanded，复制按钮提供明确中文 aria-label。",
  ],
};
