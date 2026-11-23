"use client";

import { AiCitation } from "@matt-ui/ui";

export default function AiCitationApiDemo() {
  return (
    <AiCitation
      variant="popover"
      answer="浮层与阴影配方在构建阶段统一收敛至 CSS 变量，确保磨砂背景与高对比度文本在浅色/深色主题间保持一致。"
      sources={[
        {
          id: "c1",
          index: 1,
          title: "C 端物理高光与多层阴影规范",
          domain: "packages/tokens/shadows.css",
          badge: "CSS",
          score: "99% 匹配",
          publishedAt: "2026-11",
          snippet: "通过 inset 0 1px 0 顶部内高光与底部微斜切唇边，赋予按钮与卡片真实触感。",
        },
        {
          id: "c2",
          index: 2,
          title: "四周圆角悬浮 Sheet 布局设计",
          domain: "packages/ui/sheet.variants.ts",
          badge: "UI",
          score: "96% 匹配",
          publishedAt: "2026-11",
          snippet: "默认 inset=true 保持与视口上下及侧边 16px 呼吸间距，四周采用 16px 圆角。",
        },
      ]}
    />
  );
}
