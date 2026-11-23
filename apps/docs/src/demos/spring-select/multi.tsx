"use client";

/**
 * 示例：多选模式（multiple），支持连续勾选、复选指示框、触发器芯片折叠 (+N) 与一键清空。
 */
import { SpringSelect } from "@matt-ui/ui";
import { Layers } from "lucide-react";
import { useState } from "react";

const STACKS = [
  { value: "nextjs", label: "Next.js", group: "前端框架", badge: "v16" },
  { value: "react", label: "React", group: "前端框架", badge: "v19" },
  { value: "astro", label: "Astro", group: "前端框架" },
  { value: "typescript", label: "TypeScript", group: "语言与样式" },
  { value: "tailwind", label: "Tailwind CSS", group: "语言与样式", badge: "v4" },
  { value: "base-ui", label: "Base UI", group: "语言与样式" },
];

const FAILOVER_NODES = [
  { value: "tokyo", label: "Tokyo", badge: "18ms", dot: "success" as const },
  { value: "singapore", label: "Singapore", badge: "32ms", dot: "success" as const },
  { value: "frankfurt", label: "Frankfurt", badge: "95ms", dot: "warning" as const },
  { value: "oregon", label: "Oregon", badge: "128ms", dot: "muted" as const },
];

export default function SpringSelectMultiDemo() {
  const [stacks, setStacks] = useState<string[]>(["nextjs", "typescript", "tailwind"]);
  const [nodes, setNodes] = useState<string[]>(["tokyo", "singapore"]);

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
      <SpringSelect
        multiple
        label="项目技术栈（多选）"
        placeholder="选择使用的技术"
        prefix={<Layers className="size-3.5" />}
        tone="signal"
        maxTagCount={2}
        clearable
        hint="超出 2 项自动折叠为 +N，面板底部支持一键清空"
        options={STACKS}
        value={stacks}
        onValueChange={setStacks}
        className="max-w-none"
      />
      <SpringSelect
        multiple
        label="多区域容灾节点"
        placeholder="选择容灾节点"
        variant="filled"
        radius="lg"
        tone="signal"
        maxTagCount={2}
        clearable
        hint={`当前已启用 ${nodes.length} 个容灾节点`}
        options={FAILOVER_NODES}
        value={nodes}
        onValueChange={setNodes}
        className="max-w-none"
      />
    </div>
  );
}
