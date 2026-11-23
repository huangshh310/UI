"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "@matt-ui/utils";
import type { SeparatorProps, SeparatorVariant } from "./separator.types.js";

const HORIZONTAL_LINE: Record<SeparatorVariant, string> = {
  solid: "h-px bg-border",
  dashed: "h-0 border-t border-dashed border-border bg-transparent",
  gradient: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
};

const VERTICAL_LINE: Record<SeparatorVariant, string> = {
  solid: "w-px bg-border",
  dashed: "w-0 border-l border-dashed border-border bg-transparent",
  gradient: "w-px bg-gradient-to-b from-transparent via-border to-transparent",
};

export const Separator = ({
  orientation = "horizontal",
  label,
  labelAlign = "center",
  variant = "solid",
  className,
}: SeparatorProps) => {
  if (orientation === "horizontal" && label) {
    const lineClass = cn("flex-1", HORIZONTAL_LINE[variant]);
    return (
      <div
        data-slot="separator"
        data-orientation="horizontal"
        data-align={labelAlign}
        data-variant={variant}
        className={cn("flex w-full items-center gap-3", className)}
      >
        {labelAlign !== "left" && <BaseSeparator orientation="horizontal" className={lineClass} />}
        <span
          data-slot="separator-label"
          className="shrink-0 font-sans text-xs font-medium tracking-[0.01em] text-muted-foreground"
        >
          {label}
        </span>
        {labelAlign !== "right" && <BaseSeparator orientation="horizontal" className={lineClass} />}
      </div>
    );
  }

  return (
    <BaseSeparator
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "horizontal"
          ? cn("w-full", HORIZONTAL_LINE[variant])
          : cn("h-full min-h-4", VERTICAL_LINE[variant]),
        className,
      )}
    />
  );
};
