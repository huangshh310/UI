"use client";

/**
 * 响应式宽度切换器：用于区块与宽组件详情页，支持在自适应全宽、平板与移动端宽度之间实时验证布局。
 */
import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { ReactNode } from "react";

export type PreviewViewport = "full" | "tablet" | "mobile";

const VIEWPORTS: { id: PreviewViewport; label: string; widthClass: string }[] = [
  { id: "full", label: "桌面全宽", widthClass: "w-full" },
  { id: "tablet", label: "平板 768px", widthClass: "w-full max-w-[768px]" },
  { id: "mobile", label: "移动 390px", widthClass: "w-full max-w-[390px]" },
];

const ViewportIcon = ({ id }: { id: PreviewViewport }) => {
  if (id === "tablet") return <Tablet aria-hidden="true" className="size-3.5" />;
  if (id === "mobile") return <Smartphone aria-hidden="true" className="size-3.5" />;
  return <Monitor aria-hidden="true" className="size-3.5" />;
};

export const ViewportSwitcher = ({
  value,
  onChange,
}: {
  value: PreviewViewport;
  onChange: (next: PreviewViewport) => void;
}) => (
  <fieldset
    aria-label="预览视口宽度"
    className="m-0 hidden items-center gap-0.5 rounded-full border border-border/80 bg-(--site-stage) p-0.5 md:inline-flex"
  >
    {VIEWPORTS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        aria-label={label}
        aria-pressed={value === id}
        title={label}
        onClick={() => onChange(id)}
        className={`inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          value === id
            ? "border-border bg-(--site-surface) text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ViewportIcon id={id} />
      </button>
    ))}
  </fieldset>
);

export const ViewportFrame = ({
  viewport,
  children,
}: {
  viewport: PreviewViewport;
  children: ReactNode;
}) => {
  const widthClass = VIEWPORTS.find((v) => v.id === viewport)?.widthClass ?? "w-full";
  const constrained = viewport !== "full";
  return (
    <div
      className={`mx-auto flex justify-center transition-[max-width] duration-(--ui-duration-normal) ${widthClass} ${
        constrained
          ? "rounded-xl border border-dashed border-border/90 bg-background/70 p-3 shadow-xs"
          : ""
      }`}
    >
      {children}
    </div>
  );
};
