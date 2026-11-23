"use client";

/**
 * DrawCheckbox 的内部视觉部件：SVG 路径绘制对勾、图标容器、文案块与错误提示。
 */
import { cn } from "@matt-ui/utils";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { DrawCheckboxSize, DrawCheckboxVariant } from "./draw-checkbox.types.js";
import { drawCheckboxGlyphVariants, drawCheckboxTitleVariants } from "./draw-checkbox.variants.js";

export const CheckGlyph = ({
  indeterminate,
  size,
}: {
  indeterminate: boolean;
  size: DrawCheckboxSize;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn(
      drawCheckboxGlyphVariants({ size }),
      "opacity-0 transition-opacity duration-(--ui-duration-instant) group-data-checked/cb:opacity-100 group-data-indeterminate/cb:opacity-100",
    )}
  >
    {indeterminate ? (
      <path d="M5 10H15" />
    ) : (
      <path
        d="M4.5 10.5L8.2 14.2L15.5 6.2"
        strokeDasharray={22}
        className="[stroke-dashoffset:22] transition-[stroke-dashoffset] duration-(--ui-duration-normal) ease-out group-data-checked/cb:[stroke-dashoffset:0]"
      />
    )}
  </svg>
);

export const LeadingIcon = ({
  icon,
  variant,
}: {
  icon?: ReactNode;
  variant: DrawCheckboxVariant;
}) => {
  if (!icon) return null;
  if (variant === "card") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-secondary/65 text-foreground transition-colors duration-(--ui-duration-fast) group-has-[[data-checked]]/item:border-border group-has-[[data-checked]]/item:bg-card"
      >
        {icon}
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center text-muted-foreground">
      {icon}
    </span>
  );
};

export const LabelContent = ({
  label,
  description,
  badge,
  size,
}: {
  label: string;
  description?: string;
  badge?: ReactNode;
  size: DrawCheckboxSize;
}) => (
  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={drawCheckboxTitleVariants({ size })}>{label}</span>
      {badge && (
        <span className="inline-flex items-center rounded-full border border-border/80 bg-secondary px-2 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground">
          {badge}
        </span>
      )}
    </span>
    {description && (
      <span className="text-xs leading-relaxed text-muted-foreground transition-opacity duration-(--ui-duration-fast) group-data-strikethrough/item:group-has-[[data-checked]]/item:opacity-60">
        {description}
      </span>
    )}
  </span>
);

export const TrailingMeta = ({ trailing }: { trailing?: ReactNode }) =>
  trailing ? (
    <span className="shrink-0 font-mono text-xs font-medium text-muted-foreground tabular-nums">
      {trailing}
    </span>
  ) : null;

export const CheckboxError = ({ id, error }: { id: string; error?: string }) =>
  error ? (
    <p id={id} role="alert" className={cn("m-0 flex items-start gap-1.5 text-xs text-destructive")}>
      <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  ) : null;
