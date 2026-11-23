"use client";

import { ResizablePanels } from "@matt-ui/ui";

export default function ResizablePanelsVerticalDemo() {
  return (
    <ResizablePanels
      orientation="vertical"
      handleStyle="line"
      className="h-56 max-w-md"
      panels={[
        {
          id: "editor",
          defaultSize: 62,
          minSize: 35,
          content: (
            <div className="flex h-full flex-col gap-1.5 bg-card p-3.5">
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Editor · tabs.tsx
              </span>
              <pre className="m-0 font-mono text-xs leading-relaxed text-foreground">
                {`<Tabs variant="enclosed" size="md" items={items} />`}
              </pre>
            </div>
          ),
        },
        {
          id: "terminal",
          defaultSize: 38,
          minSize: 25,
          content: (
            <div className="flex h-full flex-col gap-1 bg-secondary/45 p-3.5 font-mono text-xs dark:bg-white/[0.03]">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Terminal
              </span>
              <span className="text-emerald-700 dark:text-emerald-300">
                ✓ 10 test files passed (248ms)
              </span>
            </div>
          ),
        },
      ]}
    />
  );
}
