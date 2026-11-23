"use client";

import { SegmentedControl } from "@matt-ui/motion";
import { LayoutGrid, List, Sparkles, Terminal } from "lucide-react";

export default function SegmentedControlVariantsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <SegmentedControl
        ariaLabel="磨砂视图切换"
        variant="glass"
        size="sm"
        defaultValue="grid"
        items={[
          { value: "grid", label: "网格", icon: <LayoutGrid className="size-3.5" /> },
          { value: "list", label: "列表", icon: <List className="size-3.5" /> },
        ]}
      />
      <SegmentedControl
        ariaLabel="信号蓝运行模式"
        variant="signal"
        size="md"
        fullWidth
        defaultValue="auto"
        items={[
          { value: "auto", label: "自动路由", icon: <Sparkles className="size-3.5" /> },
          {
            value: "cli",
            label: "终端优先",
            icon: <Terminal className="size-3.5" />,
            badge: "Pro",
          },
          { value: "audit", label: "只读审计", disabled: true },
        ]}
      />
    </div>
  );
}
