"use client";

import { SpotlightSearch } from "@matt-ui/motion";
import { Layers, Sparkles, Table2 } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  {
    id: "data-table",
    title: "DataTable 数据表格",
    description: "排序、搜索与分页表格",
    category: "表单",
    shortcut: "T",
    meta: "@matt-ui/ui",
    icon: <Table2 className="size-3.5" />,
    preview: "基于 TanStack Table v9 构建，内置排序、搜索、分页与行勾选状态。",
  },
  {
    id: "settle-modal",
    title: "SettleModal 模态框",
    description: "居中阻尼落位弹窗",
    category: "浮层",
    shortcut: "M",
    meta: "@matt-ui/ui",
    icon: <Layers className="size-3.5" />,
    preview: "基于 Base UI Dialog，支持焦点陷阱、滚动锁定与关闭后焦点恢复。",
  },
  {
    id: "prompt-input",
    title: "PromptInput 对话输入器",
    description: "支持附件、模型与流式停止",
    category: "AI",
    shortcut: "P",
    meta: "@matt-ui/ui",
    icon: <Sparkles className="size-3.5" />,
    preview: "处理中文输入法组合态，避免回车误发送，适配现代 AI 对话界面。",
  },
];

export default function SpotlightSearchBasicDemo() {
  const [selected, setSelected] = useState("未选择");

  return (
    <div className="flex flex-col items-center gap-2.5">
      <SpotlightSearch
        triggerLabel="打开聚焦搜索"
        items={ITEMS}
        recentQueries={["DataTable", "浮层"]}
        onSelect={(item) => setSelected(item.title)}
      />
      <span className="font-mono text-xs text-muted-foreground">最近选中：{selected}</span>
    </div>
  );
}
