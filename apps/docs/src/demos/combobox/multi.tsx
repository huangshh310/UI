"use client";

/**
 * 示例：多选可移除芯片搜索器（multiple），边输入过滤边勾选，支持点击芯片 × 或退格删除。
 */
import { Combobox } from "@matt-ui/ui";
import { useState } from "react";

const SKILLS = [
  { value: "react", label: "React", badge: "UI", dot: "signal" as const },
  { value: "typescript", label: "TypeScript", badge: "类型", dot: "signal" as const },
  { value: "tailwind", label: "Tailwind CSS", badge: "样式", dot: "success" as const },
  { value: "nextjs", label: "Next.js", badge: "框架", dot: "muted" as const },
  { value: "motion", label: "Motion", badge: "动效", dot: "warning" as const },
  { value: "playwright", label: "Playwright", badge: "E2E", dot: "success" as const },
];

export default function ComboboxMultiDemo() {
  const [selected, setSelected] = useState<string[]>(["react", "typescript"]);

  return (
    <div className="w-full max-w-md">
      <Combobox
        multiple
        label="擅长技能标签（多选搜索）"
        placeholder="输入关键词检索并添加标签…"
        emptyText="没有匹配的技能标签"
        showSearchIcon
        hint={`已选 ${selected.length} 项；支持点选芯片 × 或按 Backspace 移除`}
        options={SKILLS}
        value={selected}
        onValueChange={setSelected}
        className="max-w-none"
      />
    </div>
  );
}
