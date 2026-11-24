"use client";

/**
 * SplitButton：一个主操作，加上一个打开相关操作菜单的箭头按钮，两者共用一个整体轮廓。
 *
 * 内置完整的下拉菜单键盘导航、焦点归位与标准 ARIA 菜单语义。
 * 两个按钮各自可以聚焦：主操作直接执行，箭头按钮打开毛玻璃下拉菜单。
 */
import { Menu } from "@base-ui/react/menu";
import { cn } from "@matt-ui/utils";
import { ChevronDown, LoaderCircle } from "lucide-react";
import type {
  SplitButtonAction,
  SplitButtonProps,
  SplitButtonRadius,
  SplitButtonSize,
  SplitButtonVariant,
} from "./split-button.types.js";
import {
  SPLIT_DIVIDER_CLASSES,
  splitGroupVariants,
  splitSegmentVariants,
} from "./split-button.variants.js";

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
