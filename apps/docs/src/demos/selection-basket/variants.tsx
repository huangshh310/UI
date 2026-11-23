"use client";

import { SelectionBasket } from "@matt-ui/motion";
import { Download, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SelectionBasketVariantsDemo() {
  const [log, setLog] = useState("点击不同风格浮舱体验操作反馈");

  const makeActions = (tag: string) => [
    {
      id: "share",
      label: "分享",
      tone: "signal" as const,
      icon: <Share2 className="size-3.5" />,
      onClick: () => setLog(`${tag}：已生成分享链接`),
    },
    {
      id: "export",
      label: "导出",
      icon: <Download className="size-3.5" />,
      onClick: () => setLog(`${tag}：已导出选中项`),
    },
    {
      id: "delete",
      label: "删除",
      tone: "destructive" as const,
      icon: <Trash2 className="size-3.5" />,
      onClick: () => setLog(`${tag}：已移至回收站`),
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3.5">
      <SelectionBasket
        count={4}
        totalCount={10}
        variant="inverted"
        floating={false}
        onSelectAll={() => setLog("inverted：已全选 10 项")}
        onClear={() => setLog("inverted：已清空选择")}
        actions={makeActions("inverted")}
      />
      <SelectionBasket
        count={2}
        variant="glass"
        size="sm"
        floating={false}
        onClear={() => setLog("glass：已清空选择")}
        actions={makeActions("glass")}
      />
      <span className="font-mono text-xs text-muted-foreground">{log}</span>
    </div>
  );
}
