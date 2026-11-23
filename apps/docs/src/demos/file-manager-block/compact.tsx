"use client";

import { FileManagerBlock, type ManagedFileEntry } from "@matt-ui/motion";
import { useState } from "react";

const MEDIA_ASSETS: ManagedFileEntry[] = [
  {
    id: "m1",
    name: "hero-spotlight.svg",
    folder: "品牌视觉",
    sizeLabel: "24 KB",
    updatedAt: "3 分钟前",
  },
  {
    id: "m2",
    name: "release-notes-v2.md",
    folder: "发布日志",
    sizeLabel: "9 KB",
    updatedAt: "20 分钟前",
  },
  {
    id: "m3",
    name: "design-system-kit.zip",
    folder: "品牌视觉",
    sizeLabel: "4.2 MB",
    updatedAt: "2 小时前",
  },
];

export default function FileManagerBlockCompactDemo() {
  const [log, setLog] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <FileManagerBlock
        initialFiles={MEDIA_ASSETS}
        title="设计资产与归档包"
        description="点击上方目录卡片可即时按分类过滤，勾选后呼出反色悬浮操作栏。"
        variant="elevated"
        basketVariant="inverted"
        compact
        onDeleteFiles={(ids) => setLog(`已移除 ${ids.length} 个归档条目（${ids.join(", ")}）`)}
      />
      {log && <span className="font-mono text-xs text-muted-foreground">{log}</span>}
    </div>
  );
}
