"use client";

import { Tree } from "@matt-ui/ui";
import { Code2, Palette, Settings } from "lucide-react";

const OUTLINE = [
  {
    id: "tokens",
    label: "design-tokens",
    icon: <Palette className="size-3.5" />,
    children: [
      { id: "tokens/light", label: "light.css", badge: "AA" },
      { id: "tokens/dark", label: "dark.css", badge: "AA" },
    ],
  },
  {
    id: "components",
    label: "components",
    icon: <Code2 className="size-3.5" />,
    children: [
      { id: "components/tabs", label: "tabs.tsx" },
      { id: "components/slider", label: "slider.tsx" },
    ],
  },
  { id: "config", label: "oxlint.json", icon: <Settings className="size-3.5" /> },
];

export default function TreeCompactDemo() {
  return (
    <div className="w-full max-w-xs rounded-2xl bg-card p-2 shadow-2xs">
      <Tree ariaLabel="侧栏紧凑文件树" variant="ghost" density="compact" nodes={OUTLINE} />
    </div>
  );
}
