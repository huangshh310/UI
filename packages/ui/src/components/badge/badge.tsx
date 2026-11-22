import { cn } from "@matt-ui/utils";
import type { BadgeProps } from "./badge.types.js";
import { badgeVariants } from "./badge.variants.js";

export const Badge = ({
  variant = "secondary",
  shape = "pill",
  dot = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) => (
  <span
    data-slot="badge"
    data-variant={variant}
    className={cn(badgeVariants({ variant, shape }), className)}
    {...props}
  >
    {dot && (
      <span
        data-slot="badge-dot"
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current"
      />
    )}
    {icon && (
      <span aria-hidden="true" className="shrink-0">
        {icon}
      </span>
    )}
    {children}
  </span>
);
