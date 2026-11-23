/**
 * AiArtifact 视觉变体与预览画布映射表。
 */
import { cva } from "class-variance-authority";
import type { AiArtifactPreviewSurface } from "./ai-artifact.types.js";

export const artifactShellVariants = cva(
  "w-full overflow-hidden rounded-xl border border-solid shadow-xs",
  {
    variants: {
      obsidian: {
        false: "border-border bg-card text-card-foreground dark:border-white/10",
        true: "[color-scheme:dark] border-zinc-800 bg-zinc-950 text-zinc-100",
      },
    },
    defaultVariants: {
      obsidian: false,
    },
  },
);

export const ARTIFACT_PREVIEW_SURFACE: Record<AiArtifactPreviewSurface, string> = {
  plain: "bg-card",
  grid: "bg-muted/20 bg-[radial-gradient(color-mix(in_srgb,var(--ui-foreground)_12%,transparent)_1px,transparent_1px)] [background-size:16px_16px] dark:bg-zinc-950/50 dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]",
  obsidian: "bg-zinc-950 text-zinc-100",
};
