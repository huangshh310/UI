"use client";

/**
 * 示例：Things 3 风格待办清单（tile 列表行 + 圆形勾选 + 划线淡出 + 实时进度条）。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { useState } from "react";

const TASKS = [
  { id: "t1", label: "确认暗黑模式主画布对比度", time: "10:30" },
  { id: "t2", label: "补齐 Lock Input 与 Draw Checkbox 示例", time: "14:00" },
  { id: "t3", label: "生成最新组件 Registry 清单", time: "16:30" },
  { id: "t4", label: "发布 v1.4.0 更新日志到社区", time: "18:00" },
];

export const DrawCheckboxChecklist = () => {
  const [done, setDone] = useState<string[]>(["t1", "t2"]);
  const percent = Math.round((done.length / TASKS.length) * 100);

  const toggle = (id: string, next: boolean) =>
    setDone((prev) => (next ? [...prev, id] : prev.filter((item) => item !== id)));

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-sm font-semibold tracking-tight text-foreground">今日发版清单</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {done.length} / {TASKS.length}
        </span>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-(--ui-duration-normal) ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        {TASKS.map((task) => (
          <DrawCheckbox
            key={task.id}
            variant="tile"
            shape="circle"
            tone="signal"
            strikethrough
            label={task.label}
            trailing={task.time}
            checked={done.includes(task.id)}
            onCheckedChange={(next) => toggle(task.id, next)}
          />
        ))}
      </div>
    </div>
  );
};
