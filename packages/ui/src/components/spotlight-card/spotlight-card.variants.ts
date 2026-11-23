import { cva } from "class-variance-authority";
import type { CSSProperties } from "react";
import type { SpotlightCardVariant, SpotlightTone } from "./spotlight-card.types.js";

export const spotlightCardVariants = cva(
  "group relative overflow-hidden rounded-[22px] border border-solid transition-[border-color,box-shadow] duration-(--ui-duration-normal) [&>*:not([data-slot=spotlight-glow]):not([data-slot=spotlight-border])]:relative [&>*:not([data-slot=spotlight-glow]):not([data-slot=spotlight-border])]:z-10",
  {
    variants: {
      variant: {
        default: "border-border/90 bg-card text-card-foreground shadow-xs dark:border-border/80",
        elevated:
          "border-border/80 bg-card text-card-foreground shadow-md dark:border-foreground/[0.09] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_-10px_rgba(0,0,0,0.48)]",
        glass:
          "border-border/70 bg-card/72 text-card-foreground shadow-sm backdrop-blur-xl backdrop-saturate-150 dark:border-foreground/12 dark:bg-card/65",
        dark: "border-white/12 bg-neutral-950 text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_32px_-12px_rgba(0,0,0,0.52)]",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      glowBorder: {
        true: "hover:border-foreground/22",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "dark",
        glowBorder: true,
        className: "hover:border-white/24",
      },
    ],
    defaultVariants: {
      variant: "default",
      padding: "md",
      glowBorder: true,
    },
  },
);

export const SPOTLIGHT_SURFACE_COLORS: Record<SpotlightTone, string> = {
  neutral: "color-mix(in srgb, var(--ui-foreground) 7%, transparent)",
  signal: "color-mix(in srgb, var(--ui-signal) 13%, transparent)",
  emerald: "rgba(16, 185, 129, 0.13)",
  violet: "rgba(139, 92, 246, 0.14)",
};

export const SPOTLIGHT_DARK_SURFACE_COLORS: Record<SpotlightTone, string> = {
  neutral: "rgba(255, 255, 255, 0.11)",
  signal: "rgba(59, 130, 246, 0.22)",
  emerald: "rgba(16, 185, 129, 0.2)",
  violet: "rgba(167, 139, 250, 0.22)",
};

export const SPOTLIGHT_BORDER_COLORS: Record<SpotlightTone, string> = {
  neutral: "color-mix(in srgb, var(--ui-foreground) 32%, transparent)",
  signal: "color-mix(in srgb, var(--ui-signal) 55%, transparent)",
  emerald: "rgba(16, 185, 129, 0.52)",
  violet: "rgba(139, 92, 246, 0.55)",
};

export const SPOTLIGHT_DARK_BORDER_COLORS: Record<SpotlightTone, string> = {
  neutral: "rgba(255, 255, 255, 0.36)",
  signal: "rgba(96, 165, 250, 0.62)",
  emerald: "rgba(52, 211, 153, 0.58)",
  violet: "rgba(196, 181, 253, 0.6)",
};

export const resolveSpotlightColors = (tone: SpotlightTone, variant: SpotlightCardVariant) => ({
  surface:
    variant === "dark" ? SPOTLIGHT_DARK_SURFACE_COLORS[tone] : SPOTLIGHT_SURFACE_COLORS[tone],
  border: variant === "dark" ? SPOTLIGHT_DARK_BORDER_COLORS[tone] : SPOTLIGHT_BORDER_COLORS[tone],
});

export const SPOTLIGHT_BORDER_MASK_STYLE: CSSProperties = {
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};
