// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

import { cn } from "@/lib/utils";
import { Separator as BaseSeparator } from "@base-ui/react/separator";

export interface SeparatorProps {
  /** 分隔方向 */
  orientation?: "horizontal" | "vertical";
  /** 仅水平模式下生效：居中嵌入的辅助标签文案 */
  label?: string;
  /** 自定义类名 */
  className?: string;
}
export const Separator = ({ orientation = "horizontal", label, className }: SeparatorProps) => {
  if (orientation === "horizontal" && label) {
    return (
      <div
        data-slot="separator"
        data-orientation="horizontal"
        className={cn("flex w-full items-center gap-3", className)}
      >
        <BaseSeparator orientation="horizontal" className="h-px flex-1 bg-border" />
        <span className="shrink-0 font-sans text-xs text-muted-foreground">{label}</span>
        <BaseSeparator orientation="horizontal" className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <BaseSeparator
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-4 w-px",
        className,
      )}
    />
  );
};
