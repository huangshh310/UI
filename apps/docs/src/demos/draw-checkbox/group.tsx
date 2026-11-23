"use client";

/**
 * 示例：半选态全选分组清单。
 */
import { DrawCheckbox } from "@matt-ui/ui";
import { useState } from "react";

const ITEMS = [
  { id: "ui", label: "@matt-ui/ui 核心包", trailing: "62 组件" },
  { id: "motion", label: "@matt-ui/motion 动效包", trailing: "34 组件" },
  { id: "tokens", label: "@matt-ui/tokens 设计变量", trailing: "双主题" },
];

export default function DrawCheckboxGroupDemo() {
  const [selected, setSelected] = useState<string[]>(["ui", "tokens"]);
  const allChecked = selected.length === ITEMS.length;
  const indeterminate = selected.length > 0 && !allChecked;

  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-border bg-card p-3.5 shadow-xs">
      <DrawCheckbox
        variant="tile"
        label="全选工作区发包目标"
        tone="signal"
        trailing={`${selected.length}/${ITEMS.length}`}
        checked={allChecked}
        indeterminate={indeterminate}
        onCheckedChange={(next) => setSelected(next ? ITEMS.map((i) => i.id) : [])}
      />
      <div className="ml-4 flex flex-col gap-0.5 border-l border-solid border-border pl-3">
        {ITEMS.map((item) => (
          <DrawCheckbox
            key={item.id}
            variant="tile"
            label={item.label}
            trailing={item.trailing}
            checked={selected.includes(item.id)}
            onCheckedChange={(next) =>
              setSelected((prev) =>
                next ? [...prev, item.id] : prev.filter((id) => id !== item.id),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
