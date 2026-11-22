"use client";

import { SelectionBasket } from "@matt-ui/motion";
import { Archive, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SelectionBasketAssetsDemo() {
  const [count, setCount] = useState(3);
  const [status, setStatus] = useState("已选 3 个发布快照");

  return (
    <div className="flex flex-col items-center gap-3">
      <SelectionBasket
        count={count}
        totalCount={8}
        floating={false}
        onSelectAll={() => setCount(8)}
        onClear={() => setCount(0)}
        actions={[
          {
            id: "archive",
            label: "归档",
            icon: <Archive className="size-3.5" />,
            onClick: () => setStatus(`已归档 ${count} 项`),
          },
          {
            id: "remove",
            label: "删除",
            tone: "destructive",
            icon: <Trash2 className="size-3.5" />,
            onClick: () => (setStatus(`已删除 ${count} 项`), setCount(0)),
          },
        ]}
      />
      <span className="font-mono text-xs text-muted-foreground">{status}</span>
    </div>
  );
}
