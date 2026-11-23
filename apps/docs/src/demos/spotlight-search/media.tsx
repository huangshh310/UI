"use client";

import { SpotlightSearch } from "@matt-ui/motion";
import { FileCode2, FileImage, FileText, Terminal } from "lucide-react";
import { useState } from "react";

const ASSETS = [
  {
    id: "tokens",
    title: "light.css",
    description: "浅色主题语义色板与对比度规范",
    category: "样式",
    shortcut: "1",
    meta: "2.4 KB · 刚刚更新",
    icon: <FileCode2 className="size-3.5" />,
    preview: "定义画布 #fafafa、纯白卡片 #ffffff 与品牌蓝 #155dfc，全部配对通过 WCAG AA 校验。",
  },
  {
    id: "hero",
    title: "hero-spotlight.png",
    description: "官网首屏磨砂视觉素材（2x）",
    category: "设计稿",
    shortcut: "2",
    meta: "1.8 MB · 2880×1620",
    icon: <FileImage className="size-3.5" />,
    preview: "包含浅色与深色双版本视网膜高清预览图，已压缩为 WebP 与 PNG 两种格式。",
  },
  {
    id: "adr",
    title: "ADR-001-interaction-engine.md",
    description: "Base UI 与 UI SDK 交互底座选型记录",
    category: "文档",
    shortcut: "3",
    meta: "4.1 KB · 已归档",
    icon: <FileText className="size-3.5" />,
    preview: "明确每个组件仅使用单一交互底座的架构边界与上游偏差监控策略。",
  },
  {
    id: "cli",
    title: "generate-registry.mjs",
    description: "shadcn Registry 自动生成脚本",
    category: "脚本",
    shortcut: "4",
    meta: "Node 22 · ESM",
    icon: <Terminal className="size-3.5" />,
    preview: "扫描 packages/ui 与 packages/motion 中的组件元数据并生成单文件分发制品。",
  },
];

export default function SpotlightSearchMediaDemo() {
  const [opened, setOpened] = useState("支持 ↑↓ 方向键切换与回车快速打开");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <SpotlightSearch
        size="lg"
        triggerLabel="检索工作区资源…"
        shortcutHint="⌘P"
        placeholder="按文件名、类型或说明检索…"
        items={ASSETS}
        recentQueries={["light.css", "ADR"]}
        onSelect={(item) => setOpened(`已打开：${item.title}`)}
      />
      <span className="font-mono text-xs text-muted-foreground">{opened}</span>
    </div>
  );
}
