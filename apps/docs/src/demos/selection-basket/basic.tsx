"use client";

import { SelectionBasket } from "@matt-ui/motion";
import { Button } from "@matt-ui/ui";
import { Archive, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SelectionBasketBasicDemo() {
  const [count, setCount] = useState(3);
  const [status, setStatus] = useState("");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          -1 项
        </Button>
        <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.min(8, c + 1))}>
          +1 项
        </Button>
      </div>
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
            id: "delete",
            label: "删除",
            tone: "destructive",
            icon: <Trash2 className="size-3.5" />,
            onClick: () => {
              setStatus(`已删除 ${count} 项`);
              setCount(0);
            },
          },
        ]}
      />
      {status && <span className="font-mono text-xs text-muted-foreground">{status}</span>}
    </div>
  );
}
