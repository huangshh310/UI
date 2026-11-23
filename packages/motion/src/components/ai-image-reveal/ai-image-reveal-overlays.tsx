"use client";

/**
 * AiImageReveal 的浮层子部件：状态胶囊、角标、显影完成重播/操作槽与失败重试遮罩。
 */
import { cn } from "@matt-ui/utils";
import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import type { AiImageRevealPhase } from "./ai-image-reveal.types.js";
import { REVEAL_EASE_OUT, REVEAL_FOCUS_RING } from "./ai-image-reveal.variants.js";

const OVERLAY_CHIP =
  "border border-solid border-border/70 bg-background/80 text-foreground backdrop-blur-md dark:border-white/12 dark:bg-neutral-950/75 dark:text-neutral-100";

const RevealStatusPill = ({ label }: { label: string }) => (
  <motion.div
    key="reveal-status"
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 3, transition: { duration: 0.18 } }}
    transition={{ duration: 0.24, ease: REVEAL_EASE_OUT }}
    className={cn(
      "absolute bottom-2.5 left-2.5 inline-flex h-7 items-center gap-2 rounded-full px-2.5 text-[11px] font-medium shadow-xs",
      OVERLAY_CHIP,
    )}
  >
    <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
    <span>{label}</span>
  </motion.div>
);

const RevealErrorOverlay = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/85 px-6 text-center backdrop-blur-md"
  >
    <p className="m-0 rounded-lg border border-solid border-destructive/30 bg-destructive/8 px-3 py-1.5 text-xs text-foreground dark:border-destructive/40 dark:bg-destructive/14">
      图像加载失败，请重试。
    </p>
    <button
      type="button"
      onClick={onRetry}
      className={cn(
        "h-8 cursor-pointer rounded-lg border border-solid border-transparent bg-primary px-3.5 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90",
        REVEAL_FOCUS_RING,
      )}
    >
      重新生成
    </button>
  </div>
);

const RevealDoneControls = ({
  showReplayButton,
  actions,
  onRetry,
}: {
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}) => (
  <>
    {showReplayButton && (
      <button
        type="button"
        aria-label="重播显影动画"
        onClick={onRetry}
        className={cn(
          "absolute top-2.5 right-2.5 inline-flex h-6 cursor-pointer items-center gap-1 rounded-full px-2 font-sans text-[11px] font-medium transition-colors hover:bg-background/95 dark:hover:bg-neutral-900/90",
          OVERLAY_CHIP,
          REVEAL_FOCUS_RING,
        )}
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        <span>重播</span>
      </button>
    )}
    {actions && (
      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">{actions}</div>
    )}
  </>
);

export interface RevealOverlaysProps {
  phase: AiImageRevealPhase;
  reduce: boolean;
  generatingLabel: string;
  badge?: string;
  showReplayButton: boolean;
  actions?: ReactNode;
  onRetry: () => void;
}

export const RevealOverlays = (p: RevealOverlaysProps) => {
  const pending = p.phase === "idle" || p.phase === "gather";
  return (
    <>
      {p.badge && (
        <span
          className={cn(
            "pointer-events-none absolute top-2.5 left-2.5 inline-flex h-6 items-center rounded-full px-2 font-mono text-[10px] font-medium",
            OVERLAY_CHIP,
          )}
        >
          {p.badge}
        </span>
      )}
      {p.phase === "done" && (
        <RevealDoneControls
          showReplayButton={p.showReplayButton}
          actions={p.actions}
          onRetry={p.onRetry}
        />
      )}
      {p.reduce && pending && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-foreground/[0.06]" />
      )}
      <AnimatePresence>{pending && <RevealStatusPill label={p.generatingLabel} />}</AnimatePresence>
      {p.phase === "error" && <RevealErrorOverlay onRetry={p.onRetry} />}
    </>
  );
};
