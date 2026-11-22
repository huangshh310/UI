"use client";

import { ReorderList, type ReorderListItem } from "@matt-ui/motion";
import { useState } from "react";

const TASKS: ReorderListItem[] = [
  { id: "p1", title: "悬浮圆角 Sheet 升级", subtitle: "支持四周留白与四方向弹出", badge: "P0" },
  {
    id: "p2",
    title: "12 套可复用页面区块",
    subtitle: "团队、账单、动态流与 AI 工作台",
    badge: "P0",
  },
  {
    id: "p3",
    title: "多场景示例与宽度预览",
    subtitle: "桌面 / 平板 / 移动端实时验证",
    badge: "P1",
  },
];

export default function ReorderListRoadmapDemo() {
  const [order, setOrder] = useState(TASKS.map((t) => t.id));

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <ReorderList
        ariaLabel="需求排期重排列表"
        items={TASKS}
        value={order}
        onValueChange={setOrder}
      />
      <span className="font-mono text-xs text-muted-foreground">排期顺序：{order.join(" → ")}</span>
    </div>
  );
}
