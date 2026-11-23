"use client";

/**
 * PeekCard：基于 Base UI PreviewCard 的悬停富内容预览卡片。
 */
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@matt-ui/utils";
import type { PeekCardProps } from "./peek-card.types.js";

const POPUP_CLASS = cn(
  "z-50 w-80 origin-(--transform-origin) rounded-2xl border border-solid border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
  "transition-[opacity,transform] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
);

const TRIGGER_LINK_CLASS = cn(
  "inline-flex items-center gap-1 rounded-md font-medium text-foreground underline decoration-border decoration-1 underline-offset-4",
  "transition-colors duration-(--ui-duration-fast) hover:text-signal hover:decoration-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

const PeekIdentityCard = ({ identity }: { identity: NonNullable<PeekCardProps["identity"]> }) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-solid border-border/75 bg-secondary/45 p-2.5">
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {identity.initials}
    </span>
    <div className="min-w-0">
      <p className="m-0 truncate text-xs font-medium text-foreground">{identity.name}</p>
      {identity.meta && (
        <p className="m-0 truncate font-mono text-[11px] text-muted-foreground">{identity.meta}</p>
      )}
    </div>
  </div>
);

type PeekCardBodyProps = Pick<
  PeekCardProps,
  "title" | "subtitle" | "value" | "identity" | "metrics" | "footerLeft" | "status" | "children"
>;

const PeekCardBody = (p: PeekCardBodyProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="m-0 truncate font-sans text-sm font-semibold text-foreground">{p.title}</p>
        {p.subtitle && (
          <p className="m-0 mt-0.5 truncate text-xs text-muted-foreground">{p.subtitle}</p>
        )}
      </div>
      {p.value && (
        <span className="shrink-0 font-mono text-sm font-semibold text-foreground tabular-nums">
          {p.value}
        </span>
      )}
    </div>
    {p.identity && <PeekIdentityCard identity={p.identity} />}
    {p.metrics && p.metrics.length > 0 && (
      <dl className="m-0 flex flex-col gap-1.5 text-xs">
        {p.metrics.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="m-0 font-mono text-foreground tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    )}
    {p.children}
    {(p.footerLeft || p.status) && (
      <div className="flex items-center justify-between gap-2 border-t border-solid border-border/75 pt-2.5 text-xs">
        <span className="text-muted-foreground">{p.footerLeft}</span>
        {p.status && (
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
            {p.status}
          </span>
        )}
      </div>
    )}
  </div>
);

export const PeekCard = ({
  trigger,
  triggerLabel = "查看预览",
  href = "#peek-card",
  title,
  subtitle,
  value,
  identity,
  metrics,
  footerLeft,
  status,
  children,
  side = "top",
  align = "center",
  delay = 200,
  open,
  onOpenChange,
  className,
}: PeekCardProps) => (
  <PreviewCard.Root open={open} onOpenChange={(next) => onOpenChange?.(next)}>
    {trigger ? (
      <PreviewCard.Trigger delay={delay} render={trigger} />
    ) : (
      <PreviewCard.Trigger delay={delay} href={href} className={TRIGGER_LINK_CLASS}>
        {triggerLabel}
      </PreviewCard.Trigger>
    )}
    <PreviewCard.Portal>
      <PreviewCard.Positioner side={side} align={align} sideOffset={10} className="z-50">
        <PreviewCard.Popup data-slot="peek-card" className={cn(POPUP_CLASS, className)}>
          <PeekCardBody
            title={title}
            subtitle={subtitle}
            value={value}
            identity={identity}
            metrics={metrics}
            footerLeft={footerLeft}
            status={status}
          >
            {children}
          </PeekCardBody>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
);
