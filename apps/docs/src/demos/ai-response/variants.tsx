"use client";

/**
 * 示例：AiResponse 无框对话画布模式（variant="ghost"）与默认展开来源卡片。
 */
import { AiResponse } from "@matt-ui/motion";

const GHOST_CONTENT = `已为你的工作区完成依赖边界扫描，结论如下：

- **零额外运行时**：所有样式通过语义 Token 与 Tailwind 工具类直接生成
- **安全可复制**：代码块内置一键复制并保留等宽对齐`;

export default function AiResponseVariantsDemo() {
  return (
    <div className="w-full max-w-2xl">
      <AiResponse
        variant="ghost"
        model="o4 Reasoning"
        modelBadge="深度思考"
        timestamp="2.1s"
        content={GHOST_CONTENT}
        defaultSourcesOpen
        sources={[
          {
            id: "g1",
            title: "ADR-001 交互底座选型",
            url: "https://matt-ui.dev/adr/001",
            snippet: "Base UI 与轻量原生组件边界说明",
          },
          {
            id: "g2",
            title: "WCAG AA 对比度验证报告",
            url: "https://matt-ui.dev/contrast",
            snippet: "全量语义色对背景 >= 4.5:1",
          },
        ]}
      />
    </div>
  );
}
