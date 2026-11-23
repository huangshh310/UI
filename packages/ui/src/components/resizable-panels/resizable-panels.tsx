"use client";

/**
 * ResizablePanels：基于精确锁版本 @ui-sdk/react/resizable 的精密分栏面板，
 * 支持 card / flush 容器、pill / line / dots 三种手柄风格与方向键比例调节。
 */
import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable";
import { cn } from "@matt-ui/utils";
import { GripHorizontal, GripVertical } from "lucide-react";
import { Fragment } from "react";
import type { ResizableHandleStyle, ResizablePanelsProps } from "./resizable-panels.types.js";
import {
  resizableDotsGripVariants,
  resizableHandleVariants,
  resizableLineGripVariants,
  resizablePillGripVariants,
  resizableRootVariants,
} from "./resizable-panels.variants.js";

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
