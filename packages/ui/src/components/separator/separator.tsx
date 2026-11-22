"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "@matt-ui/utils";
import type { SeparatorProps } from "./separator.types.js";

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
