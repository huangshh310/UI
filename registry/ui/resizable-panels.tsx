// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * ResizablePanels：基于精确锁版本 @ui-sdk/react/resizable 的精密分栏面板，
 * 支持 card / flush 容器、pill / line / dots 三种手柄风格与方向键比例调节。
 */

import { cn } from "@/lib/utils";
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable";
import { cva } from "class-variance-authority";
import { GripHorizontal, GripVertical } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export const resizableRootVariants = cva("flex h-56 w-full overflow-hidden", {
  variants: {
    variant: {
      card: "rounded-2xl border border-solid border-border/80 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-white/12",
      flush: "rounded-none border-0 bg-transparent",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    variant: "card",
    orientation: "horizontal",
  },
});

export const resizableHandleVariants = cva(
  "group relative flex shrink-0 items-center justify-center bg-border/85 transition-colors duration-(--ui-duration-fast) outline-none hover:bg-signal/65 focus-visible:bg-signal data-[dragging]:bg-signal dark:bg-white/12 dark:hover:bg-signal/75",
  {
    variants: {
      orientation: {
        horizontal: "w-px cursor-col-resize px-1 bg-clip-content",
        vertical: "h-px cursor-row-resize py-1 bg-clip-content",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizablePillGripVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-solid border-border/80 bg-card text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-[transform,background-color,border-color,color] duration-(--ui-duration-fast) group-hover:scale-110 group-hover:border-signal/60 group-hover:bg-signal group-hover:text-signal-foreground group-focus-visible:border-signal group-focus-visible:bg-signal group-focus-visible:text-signal-foreground group-data-[dragging]:scale-110 group-data-[dragging]:border-signal group-data-[dragging]:bg-signal group-data-[dragging]:text-signal-foreground dark:border-white/15",
  {
    variants: {
      orientation: {
        horizontal: "h-8 w-3.5",
        vertical: "h-3.5 w-8",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizableLineGripVariants = cva(
  "pointer-events-none rounded-full bg-transparent transition-[background-color,transform] duration-(--ui-duration-fast) group-hover:bg-signal group-focus-visible:bg-signal group-data-[dragging]:bg-signal",
  {
    variants: {
      orientation: {
        horizontal: "h-full w-0.5",
        vertical: "h-0.5 w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export const resizableDotsGripVariants = cva(
  "pointer-events-none flex items-center justify-center gap-0.5 rounded-full bg-card/90 px-1 py-1 text-muted-foreground ring-1 ring-border/75 transition-colors duration-(--ui-duration-fast) group-hover:text-signal group-hover:ring-signal/50 group-focus-visible:text-signal group-focus-visible:ring-signal group-data-[dragging]:text-signal dark:ring-white/15",
  {
    variants: {
      orientation: {
        horizontal: "flex-col py-1.5",
        vertical: "flex-row px-1.5",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);
export type ResizablePanelsVariant = "card" | "flush";

export type ResizableHandleStyle = "pill" | "line" | "dots";

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
  /** 外观变体：发丝卡片容器或无边框全幅工作区 */
  variant?: ResizablePanelsVariant;
  /** 分隔手柄风格：胶囊握柄 / 极简发丝线 / 三点握柄 */
  handleStyle?: ResizableHandleStyle;
  /** 面板配置列表（至少 2 项） */
  panels: ResizablePanelItem[];
  /** 方向键单次步进百分比 */
  step?: number;
  /** 布局变化回调（各面板百分比） */
  onLayoutChange?: (layout: number[]) => void;
  /** 自定义容器类名 */
  className?: string;
}
const HandleGrip = ({
  orientation,
  handleStyle,
}: {
  orientation: "horizontal" | "vertical";
  handleStyle: ResizableHandleStyle;
}) => {
  if (handleStyle === "line") {
    return <span aria-hidden="true" className={resizableLineGripVariants({ orientation })} />;
  }
  if (handleStyle === "dots") {
    return (
      <span aria-hidden="true" className={resizableDotsGripVariants({ orientation })}>
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
        <span className="size-1 rounded-full bg-current" />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={resizablePillGripVariants({ orientation })}>
      {orientation === "horizontal" ? (
        <GripVertical className="size-2.5" />
      ) : (
        <GripHorizontal className="size-2.5" />
      )}
    </span>
  );
};

const PanelDivider = ({
  orientation,
  handleStyle,
}: {
  orientation: "horizontal" | "vertical";
  handleStyle: ResizableHandleStyle;
}) => (
  <ResizableHandle
    aria-label="调整面板比例"
    data-slot="resizable-handle"
    className={resizableHandleVariants({ orientation })}
  >
    <HandleGrip orientation={orientation} handleStyle={handleStyle} />
  </ResizableHandle>
);

export const ResizablePanels = ({
  orientation = "horizontal",
  variant = "card",
  handleStyle = "pill",
  panels,
  step = 5,
  onLayoutChange,
  className,
}: ResizablePanelsProps) => (
  <Resizable
    orientation={orientation}
    step={step}
    onLayoutChange={(layout) => onLayoutChange?.(layout)}
    data-slot="resizable-panels"
    data-variant={variant}
    data-handle-style={handleStyle}
    className={cn(resizableRootVariants({ variant, orientation }), className)}
  >
    {panels.map((panel, idx) => (
      <Fragment key={panel.id}>
        <ResizablePanel
          id={panel.id}
          defaultSize={panel.defaultSize}
          minSize={panel.minSize}
          maxSize={panel.maxSize}
          data-slot="resizable-panel"
          style={{ flexBasis: "var(--resizable-panel-size)" }}
          className="min-h-0 min-w-0 shrink grow overflow-auto"
        >
          {panel.content}
        </ResizablePanel>
        {idx < panels.length - 1 && (
          <PanelDivider orientation={orientation} handleStyle={handleStyle} />
        )}
      </Fragment>
    ))}
  </Resizable>
);
