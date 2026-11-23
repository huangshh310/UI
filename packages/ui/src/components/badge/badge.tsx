import { cn } from "@matt-ui/utils";
import type { BadgeProps } from "./badge.types.js";
import { badgeVariants } from "./badge.variants.js";

const BadgeDot = ({ pulse }: { pulse: boolean }) => (
  <span
    data-slot="badge-dot"
    aria-hidden="true"
    className="relative inline-flex size-1.5 shrink-0 items-center justify-center"
  >
    {pulse && (
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 motion-reduce:hidden" />
    )}
    <span className="relative inline-flex size-1.5 rounded-full bg-current" />
  </span>
);

export const Badge = ({
  variant = "secondary",
  shape = "pill",
  size = "md",
  dot = false,
  pulse = false,
  icon,
  children,
  className,
  ...props
}: BadgeProps) => (
  <span
    data-slot="badge"
    data-variant={variant}
    data-size={size}
    className={cn(badgeVariants({ variant, shape, size }), className)}
    {...props}
  >
    {dot && <BadgeDot pulse={pulse} />}
    {icon && (
      <span aria-hidden="true" className="inline-flex shrink-0 items-center">
        {icon}
      </span>
    )}
    {children}
  </span>
);
