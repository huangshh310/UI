"use client";

import { DrawCheckbox } from "@matt-ui/ui";
import { useState } from "react";

const ITEMS = [
  { id: "ui", label: "@matt-ui/ui 核心包" },
  { id: "motion", label: "@matt-ui/motion 动效包" },
  { id: "tokens", label: "@matt-ui/tokens 设计变量" },
];

export default function DrawCheckboxGroupDemo() {
  const [selected, setSelected] = useState<string[]>(["ui", "tokens"]);
  const allChecked = selected.length === ITEMS.length;
  const indeterminate = selected.length > 0 && !allChecked;

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <DrawCheckbox
        label="全选工作区发包目标"
        tone="signal"
        checked={allChecked}
        indeterminate={indeterminate}
        onCheckedChange={(next) => setSelected(next ? ITEMS.map((i) => i.id) : [])}
      />
      <div className="ml-5 flex flex-col gap-2 border-l border-solid border-border pl-3.5">
        {ITEMS.map((item) => (
          <DrawCheckbox
            key={item.id}
            label={item.label}
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
