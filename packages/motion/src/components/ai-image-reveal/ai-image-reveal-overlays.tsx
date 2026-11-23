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

const RevealStatusPill = ({ label }: { label: string }) => (
  <motion.div
    key="reveal-status"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
    transition={{ duration: 0.28, ease: REVEAL_EASE_OUT }}
    className="absolute bottom-3 left-3 inline-flex h-8 items-center gap-2 rounded-full border border-solid border-border/80 bg-popover/92 px-3 text-xs font-medium text-popover-foreground shadow-sm backdrop-blur-xl dark:border-white/12"
  >
    <span className="relative flex size-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-signal/45 motion-reduce:hidden" />
      <span className="relative size-2 rounded-full bg-signal" />
    </span>
    <span>{label}</span>
  </motion.div>
);

const RevealErrorOverlay = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="alert"
    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 px-6 text-center backdrop-blur-md"
  >
    <p className="m-0 rounded-lg border border-solid border-destructive/35 bg-destructive/8 px-3 py-1.5 text-xs text-foreground dark:border-destructive dark:bg-destructive/14">
      图像加载失败，请重试。
    </p>
    <button
      type="button"
      onClick={onRetry}
      className={cn(
        "h-8 cursor-pointer rounded-full border border-solid border-transparent bg-primary px-4 font-sans text-xs font-medium text-primary-foreground shadow-xs transition-transform active:scale-[0.97]",
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
          "absolute top-3 right-3 inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-solid border-border/75 bg-popover/90 px-2.5 font-sans text-[11px] font-medium text-popover-foreground shadow-xs backdrop-blur-xl transition-colors hover:bg-popover dark:border-white/12",
          REVEAL_FOCUS_RING,
        )}
      >
        <RotateCcw aria-hidden="true" className="size-3" />
        <span>重播</span>
      </button>
    )}
    {actions && (
      <div className="absolute right-3 bottom-3 flex items-center gap-1.5">{actions}</div>
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
        <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center rounded-full border border-solid border-border/75 bg-popover/88 px-2.5 py-0.5 font-mono text-[10px] font-medium text-popover-foreground shadow-xs backdrop-blur-xl dark:border-white/12">
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
