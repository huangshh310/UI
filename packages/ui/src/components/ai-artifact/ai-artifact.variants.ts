/**
 * AiArtifact 视觉变体与预览画布映射表。
 */
import { cva } from "class-variance-authority";
import type { AiArtifactPreviewSurface } from "./ai-artifact.types.js";

export const artifactShellVariants = cva(
  "w-full overflow-hidden border border-solid border-border/85 bg-card text-card-foreground",
  {
    variants: {
      variant: {
        card: "max-w-xl rounded-2xl shadow-sm",
        split: "max-w-3xl rounded-2xl shadow-sm",
        compact: "max-w-xl rounded-xl shadow-xs",
      },
    },
    defaultVariants: {
      variant: "card",
    },
  },
);

export const ARTIFACT_PREVIEW_SURFACE: Record<AiArtifactPreviewSurface, string> = {
  plain: "bg-card",
  grid: "bg-card bg-[radial-gradient(color-mix(in_srgb,var(--ui-border)_85%,transparent)_1px,transparent_1px)] [background-size:16px_16px]",
  obsidian: "[color-scheme:dark] bg-zinc-950 text-zinc-50",
};
