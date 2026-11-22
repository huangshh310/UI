"use client";

/**
 * 示例：Combobox 的输入过滤、命中高亮与一键清除。
 */
import { Combobox } from "@matt-ui/ui";
import { useState } from "react";

const FRAMEWORKS = [
  { value: "next", label: "Next.js", description: "React 全栈应用框架" },
  { value: "vite", label: "Vite", description: "轻量极速前端构建工具" },
  { value: "remix", label: "Remix", description: "以 Web 标准为核心的路由框架" },
  { value: "astro", label: "Astro", description: "内容站点与孤岛架构" },
  { value: "expo", label: "Expo", description: "跨端 React 原生工具链" },
];

export const ComboboxBasic = () => {
  const [framework, setFramework] = useState<string | null>(null);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Combobox
        label="技术栈"
        placeholder="输入关键字筛选…"
        emptyText="没有匹配的框架"
        options={FRAMEWORKS}
        value={framework}
        onValueChange={setFramework}
      />
      <p data-testid="combobox-value" className="m-0 text-xs text-muted-foreground">
        已选值：{framework ?? "未选择"}
      </p>
    </div>
  );
};
