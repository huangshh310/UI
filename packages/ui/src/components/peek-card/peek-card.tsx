"use client";

/**
 * PeekCard：基于 Base UI PreviewCard 的磨砂悬停富内容预览卡片。
 */
import { PreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@matt-ui/utils";
import type { PeekCardProps, PeekCardStatusTone } from "./peek-card.types.js";
import { peekCardPopupVariants, peekCardStatusDotVariants } from "./peek-card.variants.js";

const TRIGGER_LINK_CLASS = cn(
  "inline-flex items-center gap-1 rounded-md font-medium text-foreground underline decoration-foreground/25 decoration-1 underline-offset-4 outline-none",
  "transition-colors duration-(--ui-duration-fast) hover:text-signal hover:decoration-signal",
  "focus-visible:ring-2 focus-visible:ring-ring dark:hover:text-blue-300 dark:hover:decoration-blue-300",
);

const PeekIdentityCard = ({ identity }: { identity: NonNullable<PeekCardProps["identity"]> }) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-solid border-border/75 bg-secondary/45 p-2.5 dark:border-white/8 dark:bg-white/[0.04]">
    {identity.src ? (
      <img
        src={identity.src}
        alt={identity.name}
        className="size-8 shrink-0 rounded-full border border-solid border-border/80 object-cover dark:border-white/12"
      />
    ) : (
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-xs">
        {identity.initials}
      </span>
    )}
    <div className="min-w-0">
      <p className="m-0 truncate text-xs font-semibold text-foreground">{identity.name}</p>
      {identity.meta && (
        <p className="m-0 truncate font-mono text-[11px] text-muted-foreground">{identity.meta}</p>
      )}
    </div>
  </div>
);

type PeekCardBodyProps = Pick<
  PeekCardProps,
  | "title"
  | "subtitle"
  | "badge"
  | "value"
  | "identity"
  | "metrics"
  | "footerLeft"
  | "status"
  | "children"
> & { statusTone: PeekCardStatusTone };

const PeekCardHeader = ({
  title,
  subtitle,
  badge,
  value,
}: Pick<PeekCardBodyProps, "title" | "subtitle" | "badge" | "value">) => (
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <p className="m-0 truncate font-sans text-sm font-semibold tracking-tight text-foreground">
          {title}
        </p>
        {badge && (
          <span className="inline-flex shrink-0 items-center rounded-full border border-solid border-border/80 bg-secondary/75 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/7">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="m-0 mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    {value && (
      <span className="shrink-0 font-mono text-sm font-semibold text-foreground tabular-nums">
        {value}
      </span>
    )}
  </div>
);

const PeekCardBody = (p: PeekCardBodyProps) => (
  <div className="flex flex-col gap-3">
    <PeekCardHeader title={p.title} subtitle={p.subtitle} badge={p.badge} value={p.value} />
    {p.identity && <PeekIdentityCard identity={p.identity} />}
    {p.metrics && p.metrics.length > 0 && (
      <dl className="m-0 flex flex-col gap-1.5 text-xs">
        {p.metrics.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="m-0 font-mono font-medium text-foreground tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
    )}
    {p.children}
    {(p.footerLeft || p.status) && (
      <div className="flex items-center justify-between gap-2 border-t border-solid border-border/75 pt-2.5 text-xs dark:border-white/8">
        <span className="text-muted-foreground">{p.footerLeft}</span>
        {p.status && (
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <span
              aria-hidden="true"
              className={peekCardStatusDotVariants({ tone: p.statusTone })}
            />
            {p.status}
          </span>
        )}
      </div>
    )}
  </div>
);

export const PeekCard = (props: PeekCardProps) => {
  const {
    trigger,
    triggerLabel = "查看预览",
    href = "#peek-card",
    statusTone = "signal",
    size = "md",
    side = "top",
    align = "center",
    delay = 200,
    open,
    onOpenChange,
  } = props;

  return (
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
          <PreviewCard.Popup
            data-slot="peek-card"
            data-size={size}
            className={cn(peekCardPopupVariants({ size }), props.className)}
          >
            <PeekCardBody
              title={props.title}
              subtitle={props.subtitle}
              badge={props.badge}
              value={props.value}
              identity={props.identity}
              metrics={props.metrics}
              footerLeft={props.footerLeft}
              status={props.status}
              statusTone={statusTone}
            >
              {props.children}
            </PeekCardBody>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  );
};
