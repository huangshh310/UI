import AiArtifactBasicDemo from "@/demos/ai-artifact/basic";
import AiArtifactCodeFirstDemo from "@/demos/ai-artifact/code-first";
import type { ComponentDoc } from "./registry.types";

export const AI_ARTIFACT_DOC: ComponentDoc = {
  slug: "ai-artifact",
  name: "AI Artifact",
  description:
    "AI 生成代码与交互预览产物画布，内置微点阵悬浮预览画布、轻量语法高亮源码舞台、多版本演进切换与一键复制下载。",
  category: "ai",
  registryName: "ai-artifact",
  dependencies: ["class-variance-authority", "lucide-react"],
  createdAt: "2026-11-22",
  usage: `import { AiArtifact } from "@/components/ui/ai-artifact";

export function Example() {
  return <AiArtifact title="ReleaseCard.tsx" code="export const Card = () => null;" />;
}`,
  specimens: [
    {
      slug: "basic",
      name: "多版本交互组件预览与语法高亮源码切换",
      description:
        "顶栏集成版本分段切换器（v1/v2/v3 同步驱动预览与代码演进）、预览/源码切换、一键复制与下载操作。",
      file: "ai-artifact/basic.tsx",
      Demo: AiArtifactBasicDemo,
    },
    {
      slug: "code-first",
      name: "默认源码模式曜石语法高亮舞台",
      description:
        '通过 defaultTab="code" 与 previewSurface="obsidian" 默认聚焦带行号与语法着色的曜石源码视图。',
      file: "ai-artifact/code-first.tsx",
      Demo: AiArtifactCodeFirstDemo,
      directory: false,
    },
  ],
  api: [
    { name: "title", type: "string", defaultValue: "必填", description: "产物文件名或标题" },
    {
      name: "variant",
      type: '"card" | "split" | "compact"',
      defaultValue: '"card"',
      description: "页签切换、分栏对照或紧凑布局",
    },
    {
      name: "previewSurface",
      type: '"plain" | "grid" | "obsidian"',
      defaultValue: '"grid"',
      description: "预览画布底纹（纯净、微点阵网格或曜石暗色）",
    },
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
      defaultValue: '"tsx"',
      description: "源码语言标识",
    },
    {
      name: "showLineNumbers",
      type: "boolean",
      defaultValue: "true",
      description: "是否在源码视图显示行号",
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
      name: "onVersionChange",
      type: "(version: string) => void",
      defaultValue: "—",
      description: "切换版本号回调",
    },
    {
      name: "onTabChange",
      type: "(tab: AiArtifactTab) => void",
      defaultValue: "—",
      description: "切换预览/源码页签回调",
    },
    {
      name: "onCopy",
      type: "(code: string) => void",
      defaultValue: "—",
      description: "复制源码回调（组件内部会同步写入剪贴板）",
    },
    {
      name: "onDownload",
      type: "(code: string) => void",
      defaultValue: "—",
      description: "可选下载源码回调（传入后显示下载按钮）",
    },
  ],
  accessibility: [
    "视图切换按钮均声明 aria-pressed，复制与下载按钮提供明确 aria-label 与状态反馈。",
  ],
};
