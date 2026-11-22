"use client";

import { ResizablePanels } from "@matt-ui/ui";

const SidebarPane = () => (
  <div className="flex h-full flex-col gap-2 bg-secondary/45 p-3.5">
    <p className="m-0 font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
      Canvas Layers
    </p>
    <div className="flex flex-col gap-1">
      <span className="rounded-lg bg-blue-500/12 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-400/15 dark:text-blue-200">
        AI Orb
      </span>
      <span className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground">Prompt Dock</span>
      <span className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground">Token HUD</span>
    </div>
  </div>
);

const CanvasPane = () => (
  <div className="flex h-full flex-col justify-between bg-card p-3.5">
    <div className="flex items-center justify-between gap-2">
      <p className="m-0 text-xs font-semibold text-foreground">实时预览画布</p>
      <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
        60 FPS
      </span>
    </div>
    <div className="rounded-xl border border-solid border-border/80 bg-secondary/35 p-2.5">
      <p className="m-0 text-xs font-medium text-foreground">CSS 变量逐帧布局</p>
      <p className="m-0 mt-0.5 text-[11px] leading-snug text-muted-foreground">
        拖拽分隔条或按方向键调节宽度，零重渲染抖动。
      </p>
    </div>
  </div>
);

export default function ResizablePanelsBasicDemo() {
  return (
    <ResizablePanels
      className="h-48 max-w-md shadow-md"
      panels={[
        { id: "nav", defaultSize: 38, minSize: 24, content: <SidebarPane /> },
        { id: "canvas", defaultSize: 62, minSize: 36, content: <CanvasPane /> },
      ]}
    />
  );
}
