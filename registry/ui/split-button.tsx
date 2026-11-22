// 本文件由 scripts/generate-registry.mjs 从 packages/ui 的源码生成，请勿手工修改。
"use client";

/**
 * SplitButton：一个主操作，加上一个打开相关操作菜单的箭头按钮，两者共用一个胶囊轮廓。
 *
 * 菜单的键盘导航、焦点管理与 ARIA 语义由 Base UI 的 Menu 提供。
 * 两个按钮各自可以聚焦：主操作直接执行，箭头按钮打开菜单。
 */

import { cn } from "@/lib/utils";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

/** 下拉菜单中的一个相关操作 */
export interface SplitButtonAction {
  /** 唯一标识 */
  id: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps {
  /** 主操作上显示的内容 */
  children: ReactNode;
  /** 点击主操作时调用 */
  onClick?: () => void;
  /** 下拉菜单中的相关操作 */
  actions: SplitButtonAction[];
  /** 打开菜单的按钮的可访问名称，默认「More actions」 */
  menuLabel?: string;
  /** 禁用整个控件 */
  disabled?: boolean;
  className?: string;
}
/** 两个按钮共用的样式 */
const SEGMENT_CLASSES = cn(
  "m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center border-0 bg-primary",
  "font-sans text-sm font-medium whitespace-nowrap text-primary-foreground select-none",
  "transition-colors duration-(--ui-duration-fast) hover:bg-primary/88",
  "outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
  "disabled:pointer-events-none disabled:opacity-50",
);

export const SplitButton = ({
  children,
  onClick,
  actions,
  menuLabel = "More actions",
  disabled = false,
  className,
}: SplitButtonProps) => (
  <div data-slot="split-button" className={cn("inline-flex items-stretch gap-px", className)}>
    <button
      type="button"
      disabled={disabled}
      className={cn(SEGMENT_CLASSES, "rounded-l-full pr-4 pl-5")}
      onClick={onClick}
    >
      {children}
    </button>
    <Menu.Root>
      <Menu.Trigger
        disabled={disabled}
        aria-label={menuLabel}
        className={cn(SEGMENT_CLASSES, "group rounded-r-full pr-3.5 pl-2.5")}
      >
        <ChevronDown
          aria-hidden="true"
          className="size-4 transition-transform duration-(--ui-duration-normal) ease-out group-data-popup-open:rotate-180"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={6} className="z-(--ui-z-dropdown) outline-none">
          <Menu.Popup className="min-w-44 origin-(--transform-origin) rounded-xl border border-solid border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none transition-[scale,opacity] duration-(--ui-duration-fast) ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            {actions.map(({ id, label, onSelect, disabled: itemDisabled }) => (
              <Menu.Item
                key={id}
                disabled={itemDisabled}
                onClick={onSelect}
                className="flex cursor-default items-center rounded-lg px-3 py-2 font-sans text-sm outline-none select-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                {label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
);
