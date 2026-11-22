"use client";

import { ResizablePanels } from "@matt-ui/ui";

export default function ResizablePanelsThreePaneDemo() {
  return (
    <div className="h-52 w-full max-w-2xl">
      <ResizablePanels
        panels={[
          {
            id: "nav",
            defaultSize: 24,
            minSize: 18,
            content: (
              <div className="flex h-full flex-col justify-between p-3 text-xs">
                <span className="font-semibold text-foreground">资源大纲</span>
                <span className="text-muted-foreground">71 个组件</span>
              </div>
            ),
          },
          {
            id: "canvas",
            defaultSize: 50,
            minSize: 30,
            content: (
              <div className="flex h-full flex-col justify-between p-3 text-xs">
                <span className="font-semibold text-foreground">画布预览</span>
                <span className="text-muted-foreground">拖动两侧分隔手柄动态调整三栏宽度。</span>
              </div>
            ),
          },
          {
            id: "inspector",
            defaultSize: 26,
            minSize: 18,
            content: (
              <div className="flex h-full flex-col justify-between p-3 text-xs">
                <span className="font-semibold text-foreground">Token 检查器</span>
                <span className="font-mono text-muted-foreground">--ui-signal</span>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
