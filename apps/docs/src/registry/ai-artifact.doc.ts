import AiArtifactBasicDemo from "@/demos/ai-artifact/basic";
import AiArtifactCodeFirstDemo from "@/demos/ai-artifact/code-first";
import type { ComponentDoc } from "./registry.types";

export const AI_ARTIFACT_DOC: ComponentDoc = {
  slug: "ai-artifact",
  name: "AI Artifact",
  description: "AI 生成代码与交互预览分栏产物卡片，支持版本标记、预览/源码切换与一键复制。",
  category: "ai",
  registryName: "ai-artifact",
  dependencies: ["lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiArtifact } from "@/components/ui/ai-artifact";

export function Example() {
  return <AiArtifact title="ReleaseCard.tsx" code="export const Card = () => null;" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "生成组件实时预览与源码切换",
      description: "顶栏集成产物版本标签、预览/源码分段切换器与一键复制反馈。",
      file: "ai-artifact/basic.tsx",
      Demo: AiArtifactBasicDemo,
    },
    {
      slug: "code-first",
      name: "默认源码模式 Token 配方卡",
      description: '通过 defaultTab="code" 默认聚焦生成代码并提供语言角标。',
      file: "ai-artifact/code-first.tsx",
      Demo: AiArtifactCodeFirstDemo,
      directory: false,
    },
  ],
  api: [
    { name: "title", type: "string", defaultValue: "必填", description: "产物文件名或标题" },
    {
      name: "version",
      type: "string",
      defaultValue: '"v2 · React 19"',
      description: "版本徽章文字",
    },
    {
      name: "versions",
      type: "string[]",
      defaultValue: "—",
      description: "可选多版本切换列表（大于 1 项时渲染版本切换胶囊）",
    },
    {
      name: "language",
      type: "string",
      defaultValue: '"TSX"',
      description: "源码语言标识",
    },
    { name: "code", type: "string", defaultValue: "必填", description: "源码文本" },
    { name: "preview", type: "ReactNode", defaultValue: "—", description: "实时渲染预览内容" },
    {
      name: "defaultTab",
      type: '"preview" | "code"',
      defaultValue: '"preview"',
      description: "默认视图",
    },
    {
      name: "onCopy",
      type: "(code: string) => void",
      defaultValue: "—",
      description: "复制源码回调（组件内部会同步写入剪贴板）",
    },
  ],
  accessibility: ["视图切换按钮均声明 aria-pressed，复制按钮提供明确 aria-label 与状态文字反馈。"],
};
