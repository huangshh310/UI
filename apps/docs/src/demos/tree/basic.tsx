"use client";

import { Tree } from "@matt-ui/ui";
import { useState } from "react";

const FILES = [
  {
    id: "packages",
    label: "packages",
    badge: "4",
    children: [
      {
        id: "packages/ui",
        label: "ui",
        children: [
          { id: "packages/ui/button.tsx", label: "button.tsx", badge: "TSX" },
          { id: "packages/ui/tree.tsx", label: "tree.tsx", badge: "A11y" },
        ],
      },
      { id: "packages/tokens", label: "tokens", badge: "CSS" },
    ],
  },
  {
    id: "apps",
    label: "apps",
    badge: "2",
    children: [
      { id: "apps/docs", label: "docs", badge: "Next" },
      { id: "apps/storybook", label: "storybook", badge: "Vite" },
    ],
  },
  { id: "registry.json", label: "registry.json", badge: "JSON" },
];

export default function TreeBasicDemo() {
  const [selected, setSelected] = useState<string | null>("registry.json");

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Tree ariaLabel="工作区目录树" nodes={FILES} value={selected} onValueChange={setSelected} />
      <span className="font-mono text-xs text-muted-foreground">已选节点：{selected ?? "无"}</span>
    </div>
  );
}
