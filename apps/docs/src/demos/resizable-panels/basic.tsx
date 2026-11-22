"use client";

import { ResizablePanels } from "@matt-ui/ui";

export default function ResizablePanelsBasicDemo() {
  return (
    <ResizablePanels
      className="h-44 max-w-md"
      panels={[
        {
          id: "nav",
          defaultSize: 36,
          minSize: 22,
          content: (
            <div className="flex h-full flex-col justify-between bg-secondary/35 p-4">
              <p className="m-0 text-xs font-semibold text-foreground">组件大纲</p>
              <p className="m-0 font-mono text-[11px] text-muted-foreground">拖拽或方向键调整</p>
            </div>
          ),
        },
        {
          id: "canvas",
          defaultSize: 64,
          minSize: 35,
          content: (
            <div className="flex h-full flex-col justify-between p-4">
              <p className="m-0 text-xs font-semibold text-foreground">实时预览画布</p>
              <p className="m-0 text-xs text-muted-foreground">
                面板宽度通过 CSS 变量逐帧更新，拖拽过程零 React 重渲染抖动。
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}
