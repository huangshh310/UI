// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable";
import { GripHorizontal, GripVertical } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export interface ResizablePanelItem {
  id: string;
  /** 初始占比（百分比 0-100） */
  defaultSize?: number;
  /** 最小占比 */
  minSize?: number;
  /** 最大占比 */
  maxSize?: number;
  /** 面板内容 */
  content: ReactNode;
}

export interface ResizablePanelsProps {
  /** 分栏方向 */
  orientation?: "horizontal" | "vertical";
  /** 面板配置列表（至少 2 项） */
  panels: ResizablePanelItem[];
  /** 方向键单次步进百分比 */
  step?: number;
  /** 布局变化回调（各面板百分比） */
  onLayoutChange?: (layout: number[]) => void;
  /** 自定义容器类名 */
  className?: string;
}
const PanelDivider = ({ isHorizontal }: { isHorizontal: boolean }) => (
  <ResizableHandle
    aria-label="调整面板比例"
    className={cn(
      "group relative flex shrink-0 items-center justify-center bg-border transition-colors duration-(--ui-duration-fast) hover:bg-signal/50 focus-visible:bg-signal focus-visible:outline-none data-[dragging]:bg-signal",
      isHorizontal
        ? "w-px cursor-col-resize px-1 bg-clip-content"
        : "h-px cursor-row-resize py-1 bg-clip-content",
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-sm border border-solid border-border bg-background text-muted-foreground shadow-sm transition-colors group-hover:border-signal/40 group-hover:text-signal dark:bg-card",
        isHorizontal ? "h-6 w-3" : "h-3 w-6",
      )}
    >
      {isHorizontal ? (
        <GripVertical className="size-2.5" />
      ) : (
        <GripHorizontal className="size-2.5" />
      )}
    </span>
  </ResizableHandle>
);

export const ResizablePanels = ({
  orientation = "horizontal",
  panels,
  step = 5,
  onLayoutChange,
  className,
}: ResizablePanelsProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <Resizable
      orientation={orientation}
      step={step}
      onLayoutChange={(layout) => onLayoutChange?.(layout)}
      data-slot="resizable-panels"
      className={cn(
        "flex h-56 w-full overflow-hidden rounded-2xl border border-solid border-border bg-card shadow-sm",
        isHorizontal ? "flex-row" : "flex-col",
        className,
      )}
    >
      {panels.map((panel, idx) => (
        <Fragment key={panel.id}>
          <ResizablePanel
            id={panel.id}
            defaultSize={panel.defaultSize}
            minSize={panel.minSize}
            maxSize={panel.maxSize}
            style={{ flexBasis: "var(--resizable-panel-size)" }}
            className="min-h-0 min-w-0 shrink grow overflow-auto"
          >
            {panel.content}
          </ResizablePanel>
          {idx < panels.length - 1 && <PanelDivider isHorizontal={isHorizontal} />}
        </Fragment>
      ))}
    </Resizable>
  );
};
