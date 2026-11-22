"use client";

import { Button, DirectionalTooltip, DirectionalTooltipProvider } from "@matt-ui/ui";
import { Bold, Code2, Italic, Link2 } from "lucide-react";

const TOOLS = [
  { id: "bold", label: "加粗", shortcut: "⌘B", Icon: Bold },
  { id: "italic", label: "斜体", shortcut: "⌘I", Icon: Italic },
  { id: "code", label: "行内代码", shortcut: "⌘E", Icon: Code2 },
  { id: "link", label: "插入链接", shortcut: "⌘K", Icon: Link2 },
];

export default function DirectionalTooltipToolbarDemo() {
  return (
    <DirectionalTooltipProvider delay={120}>
      <div className="inline-flex items-center gap-1 rounded-xl border border-solid border-border bg-card p-1 shadow-xs">
        {TOOLS.map(({ id, label, shortcut, Icon }) => (
          <DirectionalTooltip
            key={id}
            side="top"
            content={
              <span className="inline-flex items-center gap-2">
                <span>{label}</span>
                <kbd className="rounded bg-background/15 px-1 font-mono text-[10px]">
                  {shortcut}
                </kbd>
              </span>
            }
          >
            <Button size="icon" variant="ghost" aria-label={label}>
              <Icon className="size-4" />
            </Button>
          </DirectionalTooltip>
        ))}
      </div>
    </DirectionalTooltipProvider>
  );
}
