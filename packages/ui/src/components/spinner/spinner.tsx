import { cn } from "@matt-ui/utils";
import type { SpinnerProps, SpinnerSize, SpinnerVariant } from "./spinner.types.js";

const RING_SIZE: Record<SpinnerSize, string> = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

const DOT_SIZE: Record<SpinnerSize, string> = {
  xs: "size-1",
  sm: "size-1.5",
  md: "size-1.5",
  lg: "size-2",
};

const BARS_WRAP_SIZE: Record<SpinnerSize, string> = {
  xs: "h-3 gap-[2px]",
  sm: "h-3.5 gap-[2.5px]",
  md: "h-4.5 gap-[3px]",
  lg: "h-6 gap-[3.5px]",
};

const BAR_WIDTH: Record<SpinnerSize, string> = {
  xs: "w-[2px]",
  sm: "w-[2.5px]",
  md: "w-[3px]",
  lg: "w-[3.5px]",
};

const RingIndicator = ({ size }: { size: SpinnerSize }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    className={cn("animate-spin motion-reduce:animate-none", RING_SIZE[size])}
  >
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
    <path
      d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const DotsIndicator = ({ size }: { size: SpinnerSize }) => (
  <span aria-hidden="true" className="inline-flex items-center gap-1">
    <span
      className={cn(
        "rounded-full bg-current animate-pulse [animation-delay:-0.3s] motion-reduce:animate-none",
        DOT_SIZE[size],
      )}
    />
    <span
      className={cn(
        "rounded-full bg-current animate-pulse [animation-delay:-0.15s] motion-reduce:animate-none",
        DOT_SIZE[size],
      )}
    />
    <span
      className={cn(
        "rounded-full bg-current animate-pulse motion-reduce:animate-none",
        DOT_SIZE[size],
      )}
    />
  </span>
);

const BarsIndicator = ({ size }: { size: SpinnerSize }) => (
  <span aria-hidden="true" className={cn("inline-flex items-center", BARS_WRAP_SIZE[size])}>
    <span
      className={cn(
        "h-[65%] rounded-full bg-current animate-pulse [animation-delay:-0.3s] motion-reduce:animate-none",
        BAR_WIDTH[size],
      )}
    />
    <span
      className={cn(
        "h-full rounded-full bg-current animate-pulse [animation-delay:-0.15s] motion-reduce:animate-none",
        BAR_WIDTH[size],
      )}
    />
    <span
      className={cn(
        "h-[65%] rounded-full bg-current animate-pulse motion-reduce:animate-none",
        BAR_WIDTH[size],
      )}
    />
  </span>
);

const renderIndicator = (variant: SpinnerVariant, size: SpinnerSize) => {
  if (variant === "dots") return <DotsIndicator size={size} />;
  if (variant === "bars") return <BarsIndicator size={size} />;
  return <RingIndicator size={size} />;
};

export const Spinner = ({
  size = "md",
  variant = "ring",
  label = "加载中",
  showLabel = false,
  className,
}: SpinnerProps) => (
  <output
    aria-label={label}
    data-slot="spinner"
    data-size={size}
    data-variant={variant}
    className={cn("inline-flex items-center justify-center gap-2 text-signal", className)}
  >
    {renderIndicator(variant, size)}
    {showLabel && (
      <span className="font-sans text-xs font-medium text-muted-foreground">{label}</span>
    )}
  </output>
);
