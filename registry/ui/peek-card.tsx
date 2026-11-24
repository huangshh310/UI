// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * PeekCard：支持悬停防抖与键盘聚焦触发的磨砂富内容链接预览卡片。
 */

import { cn } from "@/lib/utils";
import { PreviewCard } from "@base-ui/react/preview-card";
import { cva } from "class-variance-authority";
import { type ReactElement, type ReactNode } from "react";

export const peekCardPopupVariants = cva(
  [
    "z-50 origin-(--transform-origin) rounded-2xl border border-solid border-border/80 bg-popover/96 p-4 text-popover-foreground backdrop-blur-xl outline-none",
    "shadow-[0_18px_46px_-10px_rgba(0,0,0,0.16),0_3px_10px_-2px_rgba(0,0,0,0.05)]",
    "dark:border-white/10 dark:bg-popover/95 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.75)]",
    "transition-[opacity,transform] duration-(--ui-duration-fast) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    "data-starting-style:scale-[0.95] data-starting-style:opacity-0 data-ending-style:scale-[0.96] data-ending-style:opacity-0",
  ],
  {
    variants: {
      size: {
        sm: "w-72",
        md: "w-80",
        lg: "w-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const peekCardStatusDotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    tone: {
      signal: "bg-signal",
      success: "bg-emerald-500",
      warning: "bg-amber-500",
      destructive: "bg-destructive",
      muted: "bg-muted-foreground/60",
    },
  },
  defaultVariants: {
    tone: "signal",
  },
});
export type PeekCardSize = "sm" | "md" | "lg";
export type PeekCardStatusTone = "signal" | "success" | "warning" | "destructive" | "muted";

export interface PeekCardMetric {
  label: string;
  value: string;
}

export interface PeekCardIdentity {
  initials: string;
  name: string;
  meta?: string;
  src?: string;
}

export interface PeekCardProps {
  /** 自定义触发元素；省略时使用 triggerLabel + href 渲染语义链接 */
  trigger?: ReactElement;
  /** 默认触发链接文案 */
  triggerLabel?: string;
  /** 默认触发链接地址 */
  href?: string;
  /** 卡片主标题 */
  title: string;
  /** 卡片副标题 */
  subtitle?: string;
  /** 标题旁徽章标签 */
  badge?: string;
  /** 右上角核心数值或状态摘要 */
  value?: string;
  /** 嵌入身份信息块 */
  identity?: PeekCardIdentity;
  /** 键值对元信息 */
  metrics?: PeekCardMetric[];
  /** 底部左侧辅助信息 */
  footerLeft?: string;
  /** 底部右侧状态文案 */
  status?: string;
  /** 底部状态指示点色调 */
  statusTone?: PeekCardStatusTone;
  /** 卡片宽度尺寸 */
  size?: PeekCardSize;
  /** 自定义扩展内容 */
  children?: ReactNode;
  /** 弹出方向 */
  side?: "top" | "bottom" | "left" | "right";
  /** 对齐方式 */
  align?: "start" | "center" | "end";
  /** 悬停触发延迟（毫秒） */
  delay?: number;
  /** 受控显示状态 */
  open?: boolean;
  /** 状态回调 */
  onOpenChange?: (open: boolean) => void;
  /** 面板自定义类名 */
  className?: string;
}
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
