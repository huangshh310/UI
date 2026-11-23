// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SplitButton：一个主操作，加上一个打开相关操作菜单的箭头按钮，两者共用一个整体轮廓。
 *
 * 菜单的键盘导航、焦点管理与 ARIA 语义由 Base UI 的 Menu 提供。
 * 两个按钮各自可以聚焦：主操作直接执行，箭头按钮打开毛玻璃下拉菜单。
 */

import { cn } from "@/lib/utils";
import { Menu } from "@base-ui/react/menu";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, LoaderCircle } from "lucide-react";
import { type ReactNode } from "react";

const SEGMENT_BASE = [
  "m-0 box-border inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center gap-2 border border-solid",
  "font-sans font-medium tracking-[-0.01em] whitespace-nowrap select-none",
  "transition-[background-color,border-color,color,transform] duration-(--ui-duration-fast) ease-out active:scale-[0.985] motion-reduce:active:scale-100",
  "outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45",
  "data-loading:pointer-events-none",
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
].join(" ");

export const splitSegmentVariants = cva(SEGMENT_BASE, {
  variants: {
    variant: {
      primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
      signal: "border-transparent bg-signal text-signal-foreground hover:bg-signal/92",
      secondary: "border-border/70 bg-secondary text-secondary-foreground hover:bg-accent",
      outline:
        "border-border bg-card text-foreground hover:border-foreground/22 hover:bg-accent/70 dark:bg-card/85 dark:hover:bg-accent",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    size: {
      sm: "h-8 text-xs",
      md: "h-10 text-sm",
      lg: "h-11 text-[15px]",
    },
    part: {
      primary: "",
      trigger: "group",
    },
    radius: {
      pill: "",
      default: "",
    },
  },
  compoundVariants: [
    { part: "primary", size: "sm", class: "pr-3 pl-3.5" },
    { part: "primary", size: "md", class: "pr-4 pl-5" },
    { part: "primary", size: "lg", class: "pr-4.5 pl-6" },
    { part: "trigger", size: "sm", class: "pr-2.5 pl-2" },
    { part: "trigger", size: "md", class: "pr-3.5 pl-2.5" },
    { part: "trigger", size: "lg", class: "pr-4 pl-3" },
    { part: "primary", radius: "pill", class: "rounded-l-full rounded-r-none" },
    { part: "trigger", radius: "pill", class: "rounded-l-none rounded-r-full" },
    { part: "primary", radius: "default", class: "rounded-l-lg rounded-r-none" },
    { part: "trigger", radius: "default", class: "rounded-l-none rounded-r-lg" },
    { part: "primary", radius: "default", size: "lg", class: "rounded-l-xl" },
    { part: "trigger", radius: "default", size: "lg", class: "rounded-r-xl" },
    { part: "trigger", variant: "outline", class: "-ml-px" },
    { part: "trigger", variant: "secondary", class: "-ml-px" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    part: "primary",
    radius: "pill",
  },
});

/** 整个分体控件的外层阴影与圆角 */
export const splitGroupVariants = cva("inline-flex items-stretch", {
  variants: {
    variant: {
      primary:
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
      signal: "shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_1px_3px_rgba(21,93,252,0.26)]",
      secondary: "shadow-xs",
      outline: "shadow-xs",
      destructive: "shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
    },
    radius: {
      pill: "rounded-full",
      default: "rounded-lg",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  compoundVariants: [{ size: "lg", radius: "default", class: "rounded-xl" }],
  defaultVariants: {
    variant: "primary",
    radius: "pill",
    size: "md",
  },
});

/** 实底变体中间的 1px 发丝分隔线 */
export const SPLIT_DIVIDER_CLASSES = {
  primary: "bg-primary-foreground/22",
  signal: "bg-signal-foreground/25",
  destructive: "bg-destructive-foreground/25",
} as const;
type SplitVariantProps = VariantProps<typeof splitSegmentVariants>;

/** 视觉变体 */
export type SplitButtonVariant = NonNullable<SplitVariantProps["variant"]>;

/** 尺寸 */
export type SplitButtonSize = NonNullable<SplitVariantProps["size"]>;

/** 圆角风格 */
export type SplitButtonRadius = NonNullable<SplitVariantProps["radius"]>;

/** 下拉菜单中的一个相关操作 */
export interface SplitButtonAction {
  /** 唯一标识 */
  id: string;
  label: string;
  onSelect: () => void;
  /** 可选前置图标 */
  icon?: ReactNode;
  /** 可选辅助说明文案 */
  description?: string;
  /** 可选快捷键提示（纯视觉展示，如 "⌘⇧S"） */
  shortcut?: string;
  /** 是否为高危破坏性操作 */
  destructive?: boolean;
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** 主操作上显示的内容 */
  children: ReactNode;
  /** 点击主操作时调用 */
  onClick?: () => void;
  /** 下拉菜单中的相关操作 */
  actions: SplitButtonAction[];
  /** 视觉变体，默认 primary */
  variant?: SplitButtonVariant;
  /** 尺寸，默认 md */
  size?: SplitButtonSize;
  /** 圆角风格，默认 pill */
  radius?: SplitButtonRadius;
  /** 主操作是否处于加载中 */
  loading?: boolean;
  /** 打开菜单的按钮的可访问名称，默认「More actions」 */
  menuLabel?: string;
  /** 禁用整个控件 */
  disabled?: boolean;
  className?: string;
}
const POPUP_CLASSES =
  "min-w-48 origin-(--transform-origin) rounded-xl border border-solid border-border/90 bg-popover/95 p-1 text-popover-foreground shadow-[0_12px_32px_-8px_rgba(0,0,0,0.16),0_2px_6px_-1px_rgba(0,0,0,0.06)] backdrop-blur-md outline-none transition-[scale,opacity] duration-(--ui-duration-fast) ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.55)]";

const SplitMenuItem = ({ action }: { action: SplitButtonAction }) => (
  <Menu.Item
    disabled={action.disabled}
    onClick={action.onSelect}
    className={cn(
      "flex cursor-default items-start gap-2.5 rounded-lg px-2.5 py-2 font-sans text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-45",
      action.destructive
        ? "text-red-700 data-highlighted:bg-red-500/10 data-highlighted:text-red-800 dark:text-red-400 dark:data-highlighted:text-red-300"
        : "text-popover-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground",
    )}
  >
    {action.icon && (
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex shrink-0 items-center justify-center [&_svg]:size-4"
      >
        {action.icon}
      </span>
    )}
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="leading-snug font-medium">{action.label}</span>
      {action.description && (
        <span className="text-xs leading-snug text-muted-foreground">{action.description}</span>
      )}
    </span>
    {action.shortcut && (
      <kbd
        aria-hidden="true"
        className="ml-2 shrink-0 self-center font-mono text-[11px] text-muted-foreground"
      >
        {action.shortcut}
      </kbd>
    )}
  </Menu.Item>
);

interface SplitDropdownProps {
  actions: SplitButtonAction[];
  menuLabel: string;
  disabled: boolean;
  variant: SplitButtonVariant;
  size: SplitButtonSize;
  radius: SplitButtonRadius;
}

const SplitDropdown = ({
  actions,
  menuLabel,
  disabled,
  variant,
  size,
  radius,
}: SplitDropdownProps) => (
  <Menu.Root>
    <Menu.Trigger
      disabled={disabled}
      aria-label={menuLabel}
      className={splitSegmentVariants({ variant, size, radius, part: "trigger" })}
    >
      <ChevronDown
        aria-hidden="true"
        className="size-4 transition-transform duration-(--ui-duration-normal) ease-out group-data-popup-open:rotate-180"
      />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner align="end" sideOffset={6} className="z-(--ui-z-dropdown) outline-none">
        <Menu.Popup className={POPUP_CLASSES}>
          {actions.map((action) => (
            <SplitMenuItem key={action.id} action={action} />
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

const getDividerClass = (variant: SplitButtonVariant): string | undefined =>
  variant in SPLIT_DIVIDER_CLASSES
    ? SPLIT_DIVIDER_CLASSES[variant as keyof typeof SPLIT_DIVIDER_CLASSES]
    : undefined;

interface SplitPrimaryButtonProps {
  children: SplitButtonProps["children"];
  onClick?: SplitButtonProps["onClick"];
  disabled: boolean;
  loading: boolean;
  variant: SplitButtonVariant;
  size: SplitButtonSize;
  radius: SplitButtonRadius;
}

const SplitPrimaryButton = ({
  children,
  onClick,
  disabled,
  loading,
  variant,
  size,
  radius,
}: SplitPrimaryButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    aria-busy={loading || undefined}
    aria-disabled={loading || undefined}
    data-loading={loading ? "" : undefined}
    className={splitSegmentVariants({ variant, size, radius, part: "primary" })}
    onClick={() => {
      if (!loading) onClick?.();
    }}
  >
    {loading && (
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
    )}
    {children}
  </button>
);

export const SplitButton = ({
  children,
  onClick,
  actions,
  variant = "primary",
  size = "md",
  radius = "pill",
  loading = false,
  menuLabel = "More actions",
  disabled = false,
  className,
}: SplitButtonProps) => {
  const dividerClass = getDividerClass(variant);

  return (
    <div
      data-slot="split-button"
      data-variant={variant}
      data-size={size}
      data-radius={radius}
      className={cn(splitGroupVariants({ variant, radius, size }), className)}
    >
      <SplitPrimaryButton
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        variant={variant}
        size={size}
        radius={radius}
      >
        {children}
      </SplitPrimaryButton>
      {dividerClass && (
        <span aria-hidden="true" className={cn("w-px shrink-0 self-stretch", dividerClass)} />
      )}
      <SplitDropdown
        actions={actions}
        menuLabel={menuLabel}
        disabled={disabled || loading}
        variant={variant}
        size={size}
        radius={radius}
      />
    </div>
  );
};
