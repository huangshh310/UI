"use client";

/**
 * DirectionalTooltip：基于 Base UI Tooltip 的方向感知磨砂提示气泡，支持快捷键键帽与反色变体。
 */
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@matt-ui/utils";
import type {
  DirectionalTooltipProps,
  DirectionalTooltipProviderProps,
} from "./directional-tooltip.types.js";
import {
  directionalTooltipArrowVariants,
  directionalTooltipKbdVariants,
  directionalTooltipPopupVariants,
} from "./directional-tooltip.variants.js";

export const DirectionalTooltipProvider = ({
  children,
  delay = 220,
  closeDelay = 0,
  timeout = 400,
}: DirectionalTooltipProviderProps) => (
  <Tooltip.Provider delay={delay} closeDelay={closeDelay} timeout={timeout}>
    {children}
  </Tooltip.Provider>
);

export const DirectionalTooltip = ({
  content,
  shortcut,
  children,
  side = "top",
  align = "center",
  variant = "default",
  size = "sm",
  sideOffset = 8,
  delay = 220,
  open,
  onOpenChange,
  showArrow = true,
  className,
}: DirectionalTooltipProps) => (
  <Tooltip.Root open={open} onOpenChange={(next) => onOpenChange?.(next)}>
    <Tooltip.Trigger delay={delay} render={children} />
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50">
        <Tooltip.Popup
          data-slot="directional-tooltip"
          data-variant={variant}
          className={cn(directionalTooltipPopupVariants({ variant, size }), className)}
        >
          {showArrow && <Tooltip.Arrow className={directionalTooltipArrowVariants({ variant })} />}
          <span>{content}</span>
          {shortcut && <kbd className={directionalTooltipKbdVariants({ variant })}>{shortcut}</kbd>}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
