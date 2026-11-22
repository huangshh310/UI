"use client";

/**
 * DirectionalTooltip：基于 Base UI Tooltip 的方向感知提示气泡。
 */
import { Tooltip } from "@base-ui/react/tooltip";
import { cn } from "@matt-ui/utils";
import type {
  DirectionalTooltipProps,
  DirectionalTooltipProviderProps,
} from "./directional-tooltip.types.js";

const POPUP_CLASS = cn(
  "z-50 max-w-xs rounded-md border border-solid border-border bg-popover px-2.5 py-1.5 font-sans text-xs font-medium leading-snug text-popover-foreground shadow-md",
  "transition-[opacity,transform] duration-(--ui-duration-fast) ease-(--ui-ease-out) motion-reduce:transition-none",
  "data-starting-style:opacity-0 data-ending-style:opacity-0",
  "data-[side=top]:data-starting-style:translate-y-1.5 data-[side=top]:data-ending-style:translate-y-1",
  "data-[side=bottom]:data-starting-style:-translate-y-1.5 data-[side=bottom]:data-ending-style:-translate-y-1",
  "data-[side=left]:data-starting-style:translate-x-1.5 data-[side=left]:data-ending-style:translate-x-1",
  "data-[side=right]:data-starting-style:-translate-x-1.5 data-[side=right]:data-ending-style:-translate-x-1",
);

const ARROW_CLASS = cn(
  "size-2 rotate-45 border-solid border-border bg-popover",
  "data-[side=top]:-bottom-1 data-[side=top]:border-r data-[side=top]:border-b",
  "data-[side=bottom]:-top-1 data-[side=bottom]:border-t data-[side=bottom]:border-l",
  "data-[side=left]:-right-1 data-[side=left]:border-t data-[side=left]:border-r",
  "data-[side=right]:-left-1 data-[side=right]:border-b data-[side=right]:border-l",
);

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
  children,
  side = "top",
  align = "center",
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
        <Tooltip.Popup data-slot="directional-tooltip" className={cn(POPUP_CLASS, className)}>
          {showArrow && <Tooltip.Arrow className={ARROW_CLASS} />}
          {content}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);
